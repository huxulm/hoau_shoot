// 文件处理模块
var fs = require('fs');

// ant处理模块
var ant = require('ant');

var codeCopy = function () {

	function readConfig () {
		return fs.readFileSync('codeConfig.json', 'utf8');
	}

	function copyClassFile (src, dest, fileName) {
		if (!src || !dest || !fileName || fileName.length == 0) {
			return;
		};
		if (fs.existsSync(src)) {
			if (!fs.existsSync(dest)) {
				try{
					fs.mkdirSync(dest);
				} catch(e)
				{
					console.log('创建目录:[' + dest + ']失败');
					return;
				}
			};

			var destFileFullPath = new String(dest);
			fs.readFile(src, function (err, data) {
				if (err) {
					console.log('读取文件出错:[' + err + ']');
					return;
				};
				if (!destFileFullPath.endsWith('/')) {
					destFileFullPath = destFileFullPath + '/';
				};
				fs.writeFile(destFileFullPath + fileName, data, function (err) {
					if (err) {
						console.log('写入文件出错;[' + err + ']');
					} else {
						console.log('[' + destFileFullPath + fileName + ']文件写入成功!');
					}
				})
			})
		};
		return;
	}

	return {readConfig : readConfig, copyClassFile: copyClassFile};
}

var codeUtil = codeCopy();
console.log(codeUtil.readConfig());

var configObj = JSON.parse(codeUtil.readConfig());

console.log(configObj.svnLog);
codeUtil.copyClassFile('D:\\HOAU\\WSP\\_DC\\hoauNew_0421\\ant\\client\\hoau.base.jar', 'C:\\Users\\hoauadmin\\Desktop', 'newCopy.jar');