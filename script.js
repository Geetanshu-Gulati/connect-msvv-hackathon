const entrepreneurData = {
  name: "Piss",
  company: "Oops",
  location: "City, Country",
  bio: "in workforce for 10 years, etc etc"
};

function displayEntrepreneurProfile() {
  card.innerHTML = `
    <h2>${entrepreneurData.name}</h2>
    <p>Company: ${entrepreneurData.company}</p>
    <p>Location: ${entrepreneurData.location}</p>
    <p>bio: ${entrepreneurData.bio}</p>
  `;
}

displayEntrepreneurProfile();