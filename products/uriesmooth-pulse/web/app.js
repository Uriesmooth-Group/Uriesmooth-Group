const sampleUpdates = [
  {category:"Company",title:"Introducing Uriesmooth Pulse",summary:"A proposed company-wide intelligence and digest experience for approved announcements, product releases and community activity.",source:"Product foundation"},
  {category:"Products",title:"Product updates, with source context",summary:"Pulse is designed to connect approved release information while preserving each product's identity, ownership and authoritative documentation.",source:"Product architecture"},
  {category:"Engineering",title:"Evidence-led engineering bulletins",summary:"The target workflow keeps internal engineering details private and publishes only reviewed updates for the intended audience.",source:"Governance principles"},
  {category:"Community",title:"A more useful view of community activity",summary:"Future connectors can group public discussions and events, subject to source permissions, data minimization and editorial controls.",source:"Product roadmap"}
];
const feed = document.querySelector("#feed");
if (feed) {
  feed.innerHTML = sampleUpdates.map(item =>
    '<article class="feed-card"><span class="tag">' + item.category +
    '</span><h3>' + item.title + '</h3><p>' + item.summary +
    '</p><small>' + item.source + ' · Illustrative</small></article>'
  ).join("");
}
const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();
