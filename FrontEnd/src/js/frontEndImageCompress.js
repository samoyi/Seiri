
/*
 * @param {Blob}      oBlobImage:  Blob图片对象                例如，表单上传的图片文件
 * @param {Array}     aMIMEType:   允许的MIME type字符串数组    例如， ['image/jpeg', 'image/png']
 * @param {Interger}  nMaxByte:    Blob对象size上限            例如限定1MB，则设置 1024*1024
 * @param {Function}  callback:    压缩完成后的回调函数，接受一个对象类型的参数res作为结果，该结果有以下几种情况：
 *									1. 如果res.errCode属性值为1，表示传入的图片类型错误，res.errMsg值为传入的图片的MIMEType
 *									2. 如果res.errCode属性值为2，表示传入的图片尺寸超过限制，res.errMsg值为传入的图片的size值
 *									3. 如果res.errCode属性值为0，表示压缩成功：
 *										①. 如果第五个参数bDataURL==true，则res.dataURL为成功压缩后的DataURL字符串，图片类型为webp
 *										②. 如果第五个参数bDataURL==false，则res.blob为成功压缩后的blob对象，因为是用上述dataURL转换而成的，所以type也是webp
 * @param {Boolean}   bDataURL:    回调函数默认接收的压缩结果为Blob类型。如果该参数为真，在回调函数中接收到的将是DataURL，因为是Base64编码，所以数据量会比Blob多1/3
 */

function frontEndImageCompress(oBlobImage, aMIMEType, nMaxByte, callback, bDataURL){

	if( !aMIMEType.includes(oBlobImage.type) ) {
		callback({errCode: 1, errMsg: oBlobImage.type});
		return;
	}

	if(oBlobImage.size>nMaxByte){
		callback({errCode: 2, errMsg: oBlobImage.size});
		return;
	}

	// 创建FileReader实例
	let reader = new FileReader();
	reader.addEventListener("load", imageLoadedHandler);
	reader.readAsDataURL(oBlobImage);

	// 图片load后的处理函数
	function imageLoadedHandler(ev){
		let oPreview = document.createElement('img'),
			sDataURL = '';

		oPreview.onload = function(){
			// 根据图片大小按照不同比例进行压缩
			let quality = (oBlobImage.size>1024*512) ? (1024*512*0.92/oBlobImage.size) : 0.92;
			sDataURL = compress(oPreview, oBlobImage.type, quality);
			if(bDataURL){
				callback({errCode: 0, dataURL: sDataURL});
			}
			else{
				callback({errCode: 0, blob: dataURI2Blob(sDataURL)});
			}
		};
		oPreview.src = ev.target.result;
	}

	function compress(loadedImageNode, quality=0.92){
		 let cvs = document.createElement('canvas');
		 cvs.width = loadedImageNode.naturalWidth;
		 cvs.height = loadedImageNode.naturalHeight;
		 let ctx = cvs.getContext("2d").drawImage(loadedImageNode, 0, 0);
		 return cvs.toDataURL('image/webp', quality);
	}
}

function dataURI2Blob(dataURI) {
	let sBytes = atob(dataURI.split(',')[1]),
    	sMIMEType = dataURI.split(',')[0].split(':')[1].split(';')[0],
		uArr = new Uint8Array(sBytes.length);

    for(let i=0; i<sBytes.length; i++){
        uArr[i] = sBytes.charCodeAt(i);
    }
    return new Blob([uArr], {type:sMIMEType});
}

module.exports = frontEndImageCompress;
