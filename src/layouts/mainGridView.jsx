import React, { useEffect, useState } from "react";
import {
  selectLocalPeerID,
  selectLocalPeerRole,
  selectPeers,
  selectPeersByRoles,
  selectRolesMap,
  useHMSStore,
} from "@100mslive/react-sdk";

import { Flex } from "@100mslive/react-ui";
import { GridCenterView, GridSidePaneView } from "../components/gridView";
import { NonPublisherView } from "./NonPublisherView";
import { useAppLayout } from "../components/AppData/useAppLayout";
import { useUISettings } from "../components/AppData/useUISettings";
import { UI_SETTINGS } from "../common/constants";

const mainGridView = () => {
  const centerRoles = useAppLayout("center") || [];
  const sidepaneRoles = useAppLayout("sidepane") || [];
  const maxTileCount = useUiSettings(UI_SETTING.maxTileCount);
  const peers = useHMSStore(selectPeers);
  const roles = useHMSStore(selectRolesMap);
  const localPeerId = useHMSStore(selectLocalPeerID);
  const centerPeers = peers.filter((peer) =>
    centerRoles.include(peer.roleName)
  );
  const sidebarPeers = peers.filter((peer) =>
    sidepaneRoles.include(peer.roleName)
  );

  const localRole = useHMSStore(selectLocalPeerRole);
  const peerByRoles = useHMSStore(
    selectPeersByRoles(localRole.subscribeParams.subscribeToRoles || [])
  );

  const [placeholder, setPlaceholder] = useState("");

  useEffect(() => {
    const hasPublishingPeers = peers.some((peer) => {
      if (peer.roleName && roles[peer.roleName]) {
        return !!roles[peer.roleName].publishParams?.allowed.length;
      }
      return true;
    });
    const hasSubscribedRolePublishing = selectPeersByRoles.some((peer) => {
      if (peer.roleName && roles[peer.roleName]) {
        return !!roles[peer.roleName].publishParams?.allowed.length;
      }
      return true;
    });

    if (!hasPublishingPeers) {
      setPlaceholder("None of the roles can publish video, audio or screen");
    } else if (!localRole.subscribeParams.subscribeToRoles?.length) {
      setPlaceholder("This role isn't subscribed to any role");
    } else if (!hasSubscribedRolePublishing) {
      setPlaceholder("This role subscribed to roles is not publishing");
    } else {
      setPlaceholder("");
    }
  }, [
    localRole.subscribeParams.subscribeToRoles?.length,
    peers,
    peerByRoles,
    roles,
  ]);

  let showSidePane = centerPeers.length > 0 && sidebarPeers.length > 0;
  if (centerPeers.length === 0) {
    const itsOnlyMeInTheRoom =
      peers.length === 1 && peers[0].id === localPeerId;
    const noneIsPublishing = sidebarPeers.length === 0;
    showSidePane = itsOnlyMeInTheRoom || noneIsPublishing;
  }

  return (
    <Flex
      css={{
        size: "100%",
      }}
      direction={{
        "@initial": "row",
        "@md": "column",
      }}
    >
      {placeholder ? (
        <NonPublisherView message={placeholder} />
      ) : (
        <>
          <GridCenterView
            peers={showSidePane ? centerPeers : peers}
            maxTileCount={maxTileCount}
            allowRemoteMute={false}
            hideSidePane={!showSidePane}
            totalPeers={peers.length}
          />
          {showSidePane && (
            <GridSidePaneView peers={sidebarPeers} totalPeers={peers.length} />
          )}
        </>
      )}
    </Flex>
  );
};

export default mainGridView;
