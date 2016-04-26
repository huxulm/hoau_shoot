// 文件处理模块
var fs = require('fs');

// ant处理模块
var ant = require('ant');

var codeCopy = function () {

	function readConfig () {
		return fs.readFileSync('codeConfig.json', 'utf8');
	}

	function copyClassFile (src, dest, fileName) {
		console.log('源文件:' + src);
		console.log('目标文件:' + dest);
		var desDir="";

		if (!src || !dest) {
			console.log('源文件,目的地址,文件名不能为空!');
			return;
		};

		if(!(dest.charAt(dest.length -1) == '\\')) {
			desDir = dest.substring(0, dest.lastIndexOf('\\'));
			fileName = dest.substring(dest.lastIndexOf('\\') + 1);
		}
		console.log('src=' + src);
		console.log('dest=' + desDir);
		console.log('fileName=' + fileName);

		if (!fs.existsSync(src)) {
			console.log('源文件不存在或不可用:[' + src + ']');
			return;
		};

		if (fs.existsSync(src)) {
			if (!fs.existsSync(desDir)) {
				try{
					fs.mkdirSync(desDir);
					console.log('创建目录成功:' + desDir);
				} catch(e)
				{
					console.log('创建目录:[' + desDir + ']失败' + e);
					return;
				}
			};

			var destFileFullPath = new String(desDir + '\\' + fileName);

			console.log('文件全路径: ' + destFileFullPath);
			fs.readFile(src, function (err, data) {
				if (err) {
					console.log('读取文件出错:[' + err + ']');
					return;
				};
				
				fs.writeFile(destFileFullPath.toString(), data, function (err) {
					if (err) {
						console.log('写入文件出错;[' + err + ']');
					} else {
						console.log('[' + destFileFullPath + ']文件写入成功!');
					}
				})
			})
		};
		return;
	}

	// 生成服务端代码
	function serverClassesSet (conf) {
		// 缺少必要的配置项
		console.log(conf.serverClassReg);
		console.log(conf.svnLog);
		console.log(conf.outputClass);
		if (!conf || !conf.serverClassReg || !conf.svnLog || !conf.outputClass) {
			console.log('缺少必要的配置项!');
		}
		var serverClassesSet = [];
		var inputPath = conf.workSpaceProjectPath + conf.buildClass;
		var outputPath = conf.workSpaceProjectPath + conf.outputClass;

		var svnLog = fs.readFileSync(conf.svnLog);
		if (!svnLog) {
			console.log('svnLog读取为空!');
			return
		};
		console.log('svnLog已读取...');
		var updatedFileNameSet = svnLog.toString().split(/\n/g);// || svnLog.split(/\\/);
		for (var i = updatedFileNameSet.length - 1; i >= 0; i--) {
			var tmpFile = updatedFileNameSet[i];

			if (tmpFile.indexOf('java') >-1) {
				console.log('temp file: true');
				// console.log('temp file: ' + tmpFile);
			} else {
				console.log('temp file: false');
				continue;
			}

			for (var j = conf.serverClassReg.length - 1; j >= 0; j--) {
				var tmpReg = conf.serverClassReg[j];
				// console.log('temp reg: ' + tmpReg);
				if (!tmpFile || !tmpReg) {
					continue;
				} else if (tmpFile.includes(tmpReg) && tmpFile.lastIndexOf('.java') > -1) {
					var tarPath = tmpFile.split('src')[1];
					console.log('serverclass: ' + inputPath + tarPath);
					// serverClassesSet.push(inputPath + tarPath);
					// 复制class文件
					var cls = (inputPath + tarPath).replace(/\//g, '\\').replace('.java', '.class');
					var des = (outputPath + tarPath).replace(/\//g, '\\').replace('.java', '.class');
					// copyClassFile2(cls, des.substring(0, des.lastIndexOf('\\')-1), des.substring(des.lastIndexOf('\\') + 1));
					copyClassFile(cls.replace(/\\/g, '\\'), des.replace(/\\/g, '\\'), '');
				}
			};
		};
	}

	// 打包部署包入口
	function start () {
		console.log('start copy code...');
		var configObj = JSON.parse(readConfig());
		// 复制服务端代码到: /ant/classes
		serverClassesSet(configObj);
	}

	return {start: start, copyClassFile: copyClassFile};
}

var codeUtil = codeCopy();

// codeUtil.readConfig();
codeUtil.copyClassFile('D:\\HOAU\\WSP\\_DC\\hoauNew_0421\\build\\IconFactory.class', 'C:\\Users\\hoauadmin\\Desktop\\ad\\newCopy.class', '');
// codeUtil.start();