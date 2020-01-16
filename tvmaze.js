/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */

/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default imege if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
	// TODO: Make an ajax request to the searchShows api.  Remove
	// hard coded data.

	const showDataResponse = await axios.get("http://api.tvmaze.com/search/shows", { params: { q: query } });
	// console.log("Show Data Response type", Array.isArray(showDataResponse));
	// console.log("Show Data Response",showDataResponse)

	let showArr = [];
	for (let i of showDataResponse.data) {
		let obj = {
			id      : i.show.id,
			name    : i.show.name,
			summary : i.show.summary,
			image   : i.show.image
				? i.show.image.medium
				: "https://store-images.s-microsoft.com/image/apps.65316.13510798887490672.6e1ebb25-96c8-4504-b714-1f7cbca3c5ad.f9514a23-1eb8-4916-a18e-99b1a9817d15?mode=scale&q=90&h=300&w=300"
		};
		showArr.push(obj);
	}

	return showArr;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */
// shows is an object being returned from searchShows()
function populateShows(shows) {
	const $showsList = $("#shows-list");
	$showsList.empty();

	for (let show of shows) {
		let $item = $(
			`<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <img class="card-img-top" src="${show.image}">
             
            <button class="show-episodes-button">Episodes</button>
             </div>
         </div>
       </div>
      `
		);

		$showsList.append($item);
	}
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */

$("#search-form").on("submit", async function handleSearch(evt) {
	evt.preventDefault();

	let query = $("#search-query").val();
	if (!query) return;

	$("#episodes-area").hide();

	let shows = await searchShows(query);

	populateShows(shows);
});

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */

async function getEpisodes(id) {
	// TODO: get episodes from tvmaze
	//       you can get this by making GET request to
	//       http://api.tvmaze.com/shows/SHOW-ID-HERE/episodes
	// TODO: return array-of-episode-info, as described in docstring above
	const showsResponse = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
	console.log("shows response: ", showsResponse);
	let episodes = [];
	for (let episode of showsResponse.data) {
		let obj = {};
		//TODO: REFACTOR WITH DESTRUCTURING LATER
		obj.name = episode.name;
		obj.id = episode.id;
		obj.season = episode.season;
		obj.number = episode.number;
		episodes.push(obj);
	}
	console.log("episodes", episodes);
	return episodes;
}

$("#shows-list").on("click", ".show-episodes-button", async function getShowID(e) {
  let showID = +$(e.target).parent().parent().parent().attr("data-show-id");
  let showsList = await getEpisodes(showID);
  populateEpisodes(showsList);
});

function populateEpisodes(showsList) {
  for(let show of showsList){
    let {name, season, number} = show;
    $("#episodes-list").append(`<li>${name} (season ${season}, number ${number})</li>`);
  }
	$("#episodes-area").show();
}
