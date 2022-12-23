import { useMemo, useReducer, useRef } from "react";
import { AudioPlayerContext } from "lib/context";

const reducers = {
  PLAY(state, _action) {
    return { ...state, playing: true };
  },
  PAUSE(state, _action) {
    return { ...state, playing: false };
  },
};

function audioReducer(state, action) {
  return reducers[action.type](state, action);
}

export function AudioProvider({ children }) {
  let [state, dispatch] = useReducer(audioReducer, {
    playing: false,
  });

  let playerRef = useRef(null);

  let actions = useMemo(() => {
    return {
      play(data) {
        if (data) {
          if (playerRef.current.currentSrc !== data.audio.src) {
            playerRef.current.src = data.audio.src;
            playerRef.current.load();
            playerRef.current.pause();
          }
        }
        playerRef.current.play();
      },
      pause() {
        playerRef.current.pause();
      },
      toggle(data) {
        this.isPlaying(data) ? actions.pause() : actions.play(data);
      },
      isPlaying(data) {
        return data
          ? state.playing && playerRef.current.currentSrc === data.audio.src
          : state.playing;
      },
    };
  }, [state.playing]);

  let api = useMemo(() => ({ ...state, ...actions }), [state, actions]);

  return (
    <>
      <AudioPlayerContext.Provider value={api}>
        {children}
      </AudioPlayerContext.Provider>
      <audio
        ref={playerRef}
        onPlay={() => dispatch({ type: "PLAY" })}
        onPause={() => dispatch({ type: "PAUSE" })}
      />
    </>
  );
}
