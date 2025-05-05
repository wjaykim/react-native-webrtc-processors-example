package com.webrtcprocessor.processors

import android.graphics.Rect
import com.oney.WebRTCModule.videoEffects.VideoFrameProcessor
import io.github.crow_misia.libyuv.FilterMode
import io.github.crow_misia.libyuv.I420Buffer
import io.github.crow_misia.libyuv.PlanePrimitive
import org.webrtc.JavaI420Buffer
import org.webrtc.SurfaceTextureHelper
import org.webrtc.VideoFrame

class FlipFrameProcessor : VideoFrameProcessor {
    override fun process(frame: VideoFrame, textureHelper: SurfaceTextureHelper): VideoFrame {
        try {
            val flippedBuffer = flipI420BufferHorizontally(frame.buffer, frame.rotation)
            frame.release()

            return VideoFrame(flippedBuffer, frame.rotation, frame.timestampNs)
        } catch (exception: Exception) {
            return frame
        }
    }

    private fun flipI420BufferHorizontally(frameBuffer: VideoFrame.Buffer, rotation: Int): VideoFrame.Buffer {
        val src = frameBuffer.toI420() ?: return frameBuffer

        val width        = src.width
        val height       = src.height

        val sourceRect = if (rotation % 180 == 0) {
            Rect(0, 0, width, height)
        } else {
            Rect(0, 0, width, -height)
        }

        val wrappedBuffer = I420Buffer.wrap(
            PlanePrimitive.create(src.strideY, src.dataY),
            PlanePrimitive.create(src.strideU, src.dataU),
            PlanePrimitive.create(src.strideV, src.dataV),
            width,
            height,
            sourceRect
        )
        val flippedBuffer = I420Buffer.allocate(width, height)

        if (rotation % 180 == 0) {
            wrappedBuffer.mirrorTo(flippedBuffer)
        } else {
            wrappedBuffer.scale(flippedBuffer, FilterMode.NONE)
        }
        wrappedBuffer.close()
        src.release()

        val dst = JavaI420Buffer.wrap(
            width,
            height,
            flippedBuffer.planeY.buffer,
            flippedBuffer.planeY.rowStride.value,
            flippedBuffer.planeU.buffer,
            flippedBuffer.planeU.rowStride.value,
            flippedBuffer.planeV.buffer,
            flippedBuffer.planeV.rowStride.value,
        ) { flippedBuffer.close() }

        return dst
    }
}
