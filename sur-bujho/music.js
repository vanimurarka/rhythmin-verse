var context = new AudioContext()
var o = null
var g = null

// document.addEventListener('DOMContentLoaded', function() {
//   $(".js_play_sound").on("click", function(e){
//     e.preventDefault()
//     var $target = $(e.target)
//     eval($target.data("source"))
//   })

//   $(".js_stop_sound").on("click", function(e){
//     e.preventDefault()
//     o.stop()
//   })
// }, false)



function playNote(frequency, type, vol){
  o = context.createOscillator()
  g = context.createGain()
  g.gain.value += vol;
  o.type = type
  o.connect(g)
  o.frequency.value = frequency
  g.connect(context.destination)
  o.start(0)

  g.gain.exponentialRampToValueAtTime(
    0.00001, context.currentTime + 5
  )
}

