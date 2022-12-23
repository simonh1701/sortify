import { useContext, useMemo } from "react";
import { AudioPlayerContext } from "lib/context";

export function useAudioPlayer(data) {
  let player = useContext(AudioPlayerContext);

  return useMemo(
    () => ({
      ...player,
      play() {
        player.play(data);
      },
      toggle() {
        player.toggle(data);
      },
      get playing() {
        return player.isPlaying(data);
      },
      get src() {
        return data.audio.src;
      },
    }),
    [player, data]
  );
}
