#import "FlipFrameProcessor.h"

#import <Accelerate/Accelerate.h>
#import <WebRTC/WebRTC.h>

@interface FlipFrameProcessor()

@property (nonatomic, assign) CVPixelBufferPoolRef pixelBufferPool;
@property (nonatomic, assign) size_t poolWidth;
@property (nonatomic, assign) size_t poolHeight;
@end

@implementation FlipFrameProcessor

- (RTCVideoFrame *)capturer:(RTCVideoCapturer *)capturer
       didCaptureVideoFrame:(RTCVideoFrame *)frame
{
  RTCI420Buffer *flippedBuffer = [self flipFrameBufferHorizontally:frame.buffer rotation:frame.rotation];
  
  return [[RTCVideoFrame alloc] initWithBuffer:flippedBuffer rotation:frame.rotation timeStampNs:frame.timeStampNs];
}

- (id<RTCI420Buffer>)flipFrameBufferHorizontally:(id<RTCVideoFrameBuffer>)frame rotation:(RTCVideoRotation)rotation {
  id<RTCI420Buffer> src;
  if ([frame conformsToProtocol:@protocol(RTCI420Buffer)]) {
    src = (id<RTCI420Buffer>)frame;
  } else {
    src = [frame toI420];
  }
  
  RTCI420Buffer *dst = [[RTCI420Buffer alloc] initWithWidth:src.width
                                                     height:src.height];
  
  vImage_Buffer inY = {
    .data      = (void*)src.dataY,
    .height    = src.height,
    .width     = src.width,
    .rowBytes  = src.strideY
  };
  vImage_Buffer outY = {
    .data      = (void*)dst.dataY,
    .height    = dst.height,
    .width     = dst.width,
    .rowBytes  = dst.strideY
  };
  
  vImage_Buffer inU = {
    .data      = (void*)src.dataU,
    .height    = src.chromaHeight,
    .width     = src.chromaWidth,
    .rowBytes  = src.strideU
  };
  vImage_Buffer outU = {
    .data      = (void*)dst.dataU,
    .height    = dst.chromaHeight,
    .width     = dst.chromaWidth,
    .rowBytes  = dst.strideU
  };
  
  vImage_Buffer inV = {
    .data      = (void*)src.dataV,
    .height    = src.chromaHeight,
    .width     = src.chromaWidth,
    .rowBytes  = src.strideV
  };
  vImage_Buffer outV = {
    .data      = (void*)dst.dataV,
    .height    = dst.chromaHeight,
    .width     = dst.chromaWidth,
    .rowBytes  = dst.strideV
  };
  
  vImage_Error err;
  if (rotation == RTCVideoRotation_0 || rotation == RTCVideoRotation_180) {
    err = vImageHorizontalReflect_Planar8(&inY, &outY, kvImageNoFlags);
    err = err ?: vImageHorizontalReflect_Planar8(&inU, &outU, kvImageNoFlags);
    err = err ?: vImageHorizontalReflect_Planar8(&inV, &outV, kvImageNoFlags);
  } else {
    err = vImageVerticalReflect_Planar8(&inY, &outY, kvImageNoFlags);
    err = err ?: vImageVerticalReflect_Planar8(&inU, &outU, kvImageNoFlags);
    err = err ?: vImageVerticalReflect_Planar8(&inV, &outV, kvImageNoFlags);
  }
  if (err != kvImageNoError) {
    NSLog(@"vImage flip error: %ld", err);
    return src;
  }
  
  return dst;
}

@end
