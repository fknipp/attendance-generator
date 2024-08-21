let lvid;
let stsem;
let wb;

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
  } else if (step === 3) {
    const ws = wb.Sheets[wb.SheetNames[0]];
    document.querySelector(".step-3 .table").innerHTML =
      XLSX.utils.sheet_to_html(ws);
  }
}

activateStep(1);

document.querySelector(".step-1 form").addEventListener("submit", (e) => {
  e.preventDefault();
  processUrl(e.target.url.value);
});

document.querySelector(".step-1 form input").addEventListener("input", (e) => {
  e.preventDefault();
  processUrl(e.target.value);
});

function processUrl(url) {
  console.log(url);
  try {
    lvid = url.match(/lvid=([0-9]+)/)[1];
    stsem = url.match(/(stsem|studiensemester_kurzbz)=([WS]S\d\d\d\d)/)[2];
    console.log({ lvid, stsem });
    activateStep(2);
  } catch (e) {
    console.log(e);
    document.querySelector(".step-1 form .error").innerText =
      "Keine gültige Adresse.";
  }
}

document.querySelector(".step-2 form input").addEventListener("change", (e) => {
  e.preventDefault();
  processFile(e.target.files[0]);
});

async function processFile(file) {
  try {
    const data = await file.arrayBuffer();
    wb = XLSX.read(data);
    activateStep(3);
  } catch (e) {
    console.log(e);
    document.querySelector(".step-2 form .error").innerText = "Ungültige Datei";
  }
}

document.querySelector(".step-3 button").addEventListener("click", () => {
  const ws = wb.Sheets[wb.SheetNames[0]];
  const xlsData = XLSX.utils.sheet_to_json(ws);
  console.log(xlsData);

  const importData = xlsData.map(
    ({
      Datum,
      Von,
      Bis,
      Ort,
      Lektoren,
      Gruppen,
      Lehrfach,
      StundeVon,
      StundeBis,
    }) => ({
      groups: Gruppen.replace(",", ";").replace(/\s/g, ""),
      sessiondate: Datum,
      from: Von.substring(0, 5),
      to: Bis.substring(0, 5),
      description: `${Lektoren} – ${Ort} (${StundeBis - StundeVon + 1} LE)`,
      repeaton: "",
      repeatevery: "",
      repeatuntil: "",
      studentscanmark: 1,
      allowupdatestatus: "",
      passwordgrp: "",
      randompassword: 1,
      subnet: "",
      automark: 2,
      autoassignstatus: 1,
      absenteereport: 1,
      preventsharedip: "",
      preventsharediptime: "",
      calendarevent: "",
      includeqrcode: 1,
      rotateqrcode: 1,
    })
  );

  console.log(importData);

  const importWs = XLSX.utils.json_to_sheet(importData);
  const importWb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(importWb, importWs, "Sheet1");
  XLSX.writeFile(importWb, "Anwesenheit.csv", { FS: ";" });
});