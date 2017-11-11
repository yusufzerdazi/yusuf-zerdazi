var wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#1e1e1e',
    progressColor: '#3d3d3d',
    responsive: true,
    height: 60,
    interact: false,
});

wavesurfer.setMute(true);

wavesurfer.on('ready', function () {
    wavesurfer.seekTo(audioElement.currentTime / audioElement.duration);
    wavesurfer.play();
    wavesurfer.drawBuffer();
});

var playing = false;
$("footer").on('click', function () {
    if (playing) {
        audioElement.pause();
        wavesurfer.pause();
        playing = false;
    } else {
        audioElement.play();
        wavesurfer.play();
        playing = true;
    }
});

$(document).ready(function() {
  $('[data-fancybox]').fancybox({
      beforeShow: function (instance, slide) {
      //$( "#waveform" ).animate({'backgroundColor': 'rgba(30,30,30,0.87)'}, 366, function(){});
    },
    afterShow: function(instance, slide) {
        url = $("#" + slide.src.split("?id=")[1]).val();
        audioElement.setAttribute('src', url);
        audioElement.play();
        wavesurfer.load(url);
        playing = true;
    },
    beforeClose: function(instance, slide) {
      //$( "#waveform" ).animate({'backgroundColor': 'rgba(30,30,30, 0)'}, 366, function(){});
    }
  });
});

$(window).resize(function() {
  wavesurfer.drawBuffer();
});
