loadMissions = () => {
  const getMissionsQuery = () =>
    `{ launchesPast(limit:50) {id mission_name rocket {rocket { id}} links {flickr_images}}  }`;

  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: getMissionsQuery(),
    }),
  };

  fetch(`https://api.spacex.land/graphql/`, options)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById('loading-indicator').style = 'display:none';
      document.getElementById('page').style = 'display:block';
      renderMissions(data.data.launchesPast);
    });
};

loadRocketDetailsById = () => {
  const params = extractQueryParams();
  const rocketId = params.rocketId;
  if (!rocketId) {
    console.error('No rocket id provided');
  }
  const getMissionByIdQuery = () => `{rocket(id: "${rocketId}") {
      id
      name
      description
      wikipedia}}`;
  const options = {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: getMissionByIdQuery(),
    }),
  };
  fetch(`https://api.spacex.land/graphql/`, options)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById('loading-indicator').style = 'display:none';
      document.getElementById('rocket-page').style = 'display:block';
      renderRocketDetails(data.data.rocket);
    });
};

extractQueryParams = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  return Object.fromEntries(urlSearchParams.entries());
};

renderMissions = (missions) => {
  for (let i = 0; i < missions.length; i++) {
    const mission = missions[i];
    const rocketId = mission.rocket.rocket.id;
    const missionNavigate = document.createElement('a');
    missionNavigate.classList = ['mission_container'];
    missionNavigate.href = `./mission_details.html?rocketId=${rocketId}`;
    const missionContainer = document.createElement('div');
    missionContainer.classList = ['mission'];
    const missionImage = document.createElement('img');
    if (mission.links.flickr_images.length > 0) {
      missionImage.src = mission.links.flickr_images[0];
    } else {
      missionImage.src = './404.jpeg';
    }
    missionContainer.appendChild(missionImage);
    const missionName = document.createElement('label');
    missionName.innerText = mission.mission_name;
    missionContainer.appendChild(missionName);
    missionContainer.id = mission.id;
    missionNavigate.appendChild(missionContainer);
    document.getElementById('container').appendChild(missionNavigate);
  }
};

renderRocketDetails = (rocket) => {
  const rocketDescription = document.createElement('p');
  const rocketTitle = document.createElement('h2');
  const rocketWikipedia = document.createElement('a');
  rocketWikipedia.innerText = 'Click here for more info...';
  rocketWikipedia.href = rocket.wikipedia;
  rocketTitle.innerText = rocket.name;
  rocketDescription.innerText = rocket.description;
  document.getElementById('rocket-container').appendChild(rocketTitle);
  document.getElementById('rocket-container').appendChild(rocketDescription);
  document.getElementById('rocket-container').appendChild(rocketWikipedia);
};
