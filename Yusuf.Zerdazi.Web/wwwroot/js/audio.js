var wavesurfer = WaveSurfer.create({
    container: '#waveform',
    waveColor: '#1e1e1e',
    progressColor: '#3d3d3d',
    responsive: true,
    height: 60,
    interact: false
});

wavesurfer.on('ready', function () {
    wavesurfer.play();
    wavesurfer.drawBuffer();
});

$("footer").on('click', function () {
    wavesurfer.playPause();
});

$(document).ready(function() {
  $('[data-fancybox]').fancybox({
    beforeShow: function(instance, slide) {
      //$( "#waveform" ).animate({'backgroundColor': 'rgba(30,30,30,0.87)'}, 366, function(){});
    },
    afterShow: function(instance, slide) {
      url = slide.src.replace("images/big", "audio").replace("jpg", "mp3");
      wavesurfer.load(url);
    },
    beforeClose: function(instance, slide) {
      //$( "#waveform" ).animate({'backgroundColor': 'rgba(30,30,30, 0)'}, 366, function(){});
    }
  });
});

$(window).resize(function() {
  wavesurfer.drawBuffer();
});
