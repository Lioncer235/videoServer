var path = require('path');
var fs = require('fs');
var exec = require('child_process').execFile;
var ffmpeg = require('fluent-ffmpeg');

function videoAPI(osParam)
{
	this.os = osParam;
}

//gets a list of folders
videoAPI.prototype.getFolders = function(srcpath) 
{
  return fs.readdirSync(srcpath).filter(function(file) 
  {
    return fs.statSync(path.join(srcpath, file)).isDirectory();
  });
}

videoAPI.prototype.getFiles = function(dir, files_)
{
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files)
	{
        var name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory())
		{
            getFiles(name, files_);
        } else {
            files_.push(name);
        }
    }
    return files_;
}

videoAPI.prototype.startFFmpeg = function()
{
	switch(this.os)
	{
		case 'Linux':
			console.log("in linux");
			break;
		case 'Windows_NT':
			console.log("in Windows");
			exec('./ffmpeg/Windows/bin/ffmpeg.exe');
			var proc = new ffmpeg({ source: './public/media/Movies/H264_mp3(mkvmerge).mkv', nolog: true });

			//Set the path to where FFmpeg is installed
			proc.setFfmpegPath("./ffmpeg/Windows/bin/ffmpeg.exe");

			proc.withSize('50%').withFps(24).toFormat('mp4').on('end', function() 
			{
				console.log('file has been converted successfully');
			}).on('error', function(err) 
			{
				console.log('an error happened: ' + err.message);
			}).saveToFile('./public/media/Movies/Jupiter.Ascending.2015.mp4');
			break;
		case 'OSX':
			console.log("in OSX");
			break;
	}
}

module.exports = videoAPI;