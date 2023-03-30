import React, { useRef } from "react";
import {
  selectDominantSpeaker,
  useHMSStore,
  selectPeers,
} from "@100mslive/react-sdk";
import { GridCenterView, GridSidePaneView } from "../components/gridView";
import { Flex } from "@100mslive/react-ui";

const ActiveSpeakerView = () => {
  const dominantSpeaker = useHMSStore(selectDominantSpeaker);
  const latestDominantSpeaker = useRef(dominantSpeaker);

  const peers = (useHMSStore(selectPeers) || []).filter(
    (peer) =>
      peer.videoTrack || peer.audioTrack || peer.auxilaryTrack.length > 0
  );

  // if there is no current dominant speaker
  if (dominantSpeaker) {
    latestDominantSpeaker.current = dominantSpeaker;
  }

  if (peers.length == 0) {
    return null;
  }

  // we will show local peers if there are no dominant speakers
  const ActiveSpeaker = latestDominantSpeaker.current || peers[0];
  const showSidePane = ActiveSpeaker && peers.length > 1;

  return (
    <Flex css={{ size: "100%", "@lg": { flexDirection: "column" } }}>
      <GridCenterView
        peers={[ActiveSpeaker]}
        maxTileCount={1}
        hideSidePane={!showSidePane}
      />
      {showSidePane && (
        <GridSidePaneView
          peers={peers.filter((peer) => peer.id !== ActiveSpeaker.id)}
        />
      )}
    </Flex>
  );
};

export default ActiveSpeakerView;
