import { useEffect, useState } from "react";
const fetch = require("sync-fetch");

function Sv1({ movieObject }) {
  const [downloadSpeed, ChangeSpeed] = useState(0);
  const [countPeers, ChangePeers] = useState(0);
  const [processStatus, ChangeProcessStatus] = useState("");

  function getReadableFileSizeString(fileSizeInBytes) {
    var i = -1;
    var byteUnits = [" kbps", " Mbps", " Gbps", " Tbps", "Pbps", "Ebps", "Zbps", "Ybps"];
    do {
      fileSizeInBytes = fileSizeInBytes / 1024;
      i++;
    } while (fileSizeInBytes > 1024);

    return Math.max(fileSizeInBytes, 0.1).toFixed(1) + byteUnits[i];
  }

  useEffect(() => {
    function humanFileSize(bytes, si = false, dp = 1) {
      const thresh = si ? 1000 : 1024;

      if (Math.abs(bytes) < thresh) {
        return bytes + " B";
      }

      const units = si
        ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
        : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
      let u = -1;
      const r = 10 ** dp;

      do {
        bytes /= thresh;
        ++u;
      } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

      return bytes.toFixed(dp) + " " + units[u];
    }

    let listTracker = fetch("https://ngosang.github.io/trackerslist/trackers_all.txt")
      .text()
      .match(/[^\r\n]+/g);

    const trackers = [
      "wss://tracker.btorrent.xyz",
      "wss://tracker.openwebtorrent.com",
      "udp://glotorrents.pw:6969/announce",
      "udp://tracker.opentrackr.org:1337/announce",
      "udp://torrent.gresille.org:80/announce",
      "udp://tracker.openbittorrent.com:80",
      "udp://tracker.coppersurfer.tk:6969",
      "udp://tracker.leechers-paradise.org:6969",
      "udp://p4p.arenabg.ch:1337",
      "udp://p4p.arenabg.com:1337",
      "udp://tracker.internetwarriors.net:1337",
      "udp://9.rarbg.to:2710",
      "udp://9.rarbg.me:2710",
      "udp://exodus.desync.com:6969",
      "udp://tracker.cyberia.is:6969",
      "udp://tracker.torrent.eu.org:451",
      "udp://tracker.open-internet.nl:6969",
      "wss://tracker.btorrent.xyz",
      "wss://tracker.openwebtorrent.com",
      "wss://tracker.webtorrent.io",
      ...listTracker,
    ];

    const rtcConfig = {
      iceServers: [
        {
          urls: ["stun:stun.l.google.com:19305", "stun:stun1.l.google.com:19305"],
        },
      ],
    };

    const trackerOpts = {
      announce: trackers,
      rtcConfig: rtcConfig,
    };

    const torrentOpts = {
      announce: trackers,
    };

    const WebTorrent = require("webtorrent/webtorrent.min.js");
    const client = new WebTorrent({
      tracker: trackerOpts,
    });

    const torrentId = movieObject.hash;
    let handleGetProcess = null;

    client.add(torrentId, torrentOpts, function (torrent) {
      const file = torrent.files.find(function (file) {
        return file.name.endsWith(".mp4");
      });

      handleGetProcess = setInterval(() => {
        ChangeSpeed(torrent.downloadSpeed);
        ChangePeers(torrent.numPeers);
        ChangeProcessStatus(
          humanFileSize(torrent.downloaded, true) + " (" + Math.round(torrent.progress * 100) / 100 + " %)"
        );
      }, 1000);

      file.appendTo("#player");
    });

    return () => {
      if (handleGetProcess !== null) {
        clearInterval(handleGetProcess);
      }
      client.destroy();
    };
  }, [movieObject.hash]);

  return (
    <>
      <div id="player" className="webtor w-full"></div>
      <h4 className="text-white text-center">
        Speed: {getReadableFileSizeString(downloadSpeed)} - Peers: {countPeers} - Downloaded: {processStatus}
      </h4>
    </>
  );
}

export default Sv1;
