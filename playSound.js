export function playSound(sound){
    if(sound){
        let playSound = sound;
        playSound.volume = 0.4;
        playSound.play();
    }
      
      
  }