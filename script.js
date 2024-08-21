let lvid;
let stsem;

function activateStep(step) {
  document
    .querySelectorAll("section")
    .forEach((element) => (element.style.display = "none"));
  document.querySelector(`section.step-${step}`).style.display = "";

  if (step === 2) {
    console.log(new Date(1722981600000), new Date(1739919600000));
    const year = parseInt(stsem.substring(2));
    const term = stsem.substring(0, 2);
    const begin = term === "WS" ? new Date(year, 8, 7) : new Date(year, 2, 20);
    const ende =
      term === "WS" ? new Date(year + 1, 2, 19) : new Date(year, 8, 6);
    const url = `https://cis.fh-burgenland.at/cis/private/lvplan/stpl_kalender.php?type=lva&pers_uid=&ort_kurzbz=&stg_kz=&sem=&ver=&grp=&gruppe_kurzbz=&lva=${lvid}&begin=${
      begin.getTime() / 1000
    }&ende=${ende.getTime() / 1000}&format=excel`;
    document.querySelector(".step-2 a").href = url;
  }
}

document.querySelector(".step-1 form").addEventListener("submit", (e) => {
  e.preventDefault();
  console.log(e.target);
  processUrl(e.target.url.value);
});

document.querySelector(".step-1 form input").addEventListener("input", (e) => {
  e.preventDefault();
  processUrl(e.target.url);
});

function processUrl(url) {
  try {
    lvid = url.match(/lvid=([0-9]+)/)[1];
    stsem = url.match(/stsem=([WS]S\d\d\d\d)/)[1];
    console.log({ lvid, stsem });
    activateStep(2);
  } catch (e) {
    document.querySelector(".step-1 form .error").innerText =
      "Keine gültige Adresse.";
  }
}
