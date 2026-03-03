import MOVIES_DATA from "./movies.json";
import { useState } from "react";
import Sv1 from "./Sv1"
import Sv2 from "./Sv2"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
function Watch(params) {

  const [serverUse,ChangeServer] = useState(1)
  let json_data = localStorage.getItem("movieData");
  let isChoose = false;
  let movieObject={};

  if (json_data !== null && json_data !== undefined) {
    isChoose = true;
    let storageData = JSON.parse(json_data);
    if(storageData.AdSearch===1){
      movieObject.title = storageData.title;
      movieObject.english_title = "";
      movieObject.hash = storageData.hash
      movieObject.imdb_id = null;
      movieObject.backdrop_path = ""
    }
    else{
    movieObject = MOVIES_DATA.filter(function (obj) {
      return obj.id === JSON.parse(json_data).idMovie;
    }).map(function (obj) {
      return obj;
    });
    movieObject = movieObject[0];
  }
  }
  return (
    <div>
      <Link to="/">
        <h1 className="text-white pl-2 pt-3">
          <FontAwesomeIcon
            className="text-blue-600 mr-1 shadow-lg"
            icon={faArrowCircleLeft}
          />{" "}
          Back to home
        </h1>
      </Link>
      {isChoose ? (
        <div>
          <h3 className="text-center text-white text-lg font-bold pt-2 pb-2">
            {movieObject.title || movieObject.english_title}
            <p className="text-sm font-thin">{movieObject.english_title}</p>
          </h3>
          {serverUse===1? <Sv1 movieObject={movieObject} />:<Sv2 movieObject={movieObject} />}

          {/* <TorrentPlayer hash={movieObject.hash} /> */}
          <button onClick={()=>ChangeServer(1)} className="mr-3 mt-3 bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
  Server 1
</button>
<button  onClick={()=>ChangeServer(2)} className="bg-blue-500 mt-3 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded">
Server 2
</button>
          <h4 className="text-white">
            Use the subtitle button in the player to choose your preferred
            language.
          </h4>
          {/* <video
            controls
            src={movieObject[0].hash}
            poster={"https://www.themoviedb.org/t/p/w500"+movieObject[0].backdrop_path}
            width="100%"
            data-title={movieObject[0].english_title}
          ></video> */}
          {/* <track
              srclang="en"
              label="test"
              default
              src="https://raw.githubusercontent.com/andreyvit/subtitle-tools/master/sample.srt"
            ></track> */}
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
export default Watch;
