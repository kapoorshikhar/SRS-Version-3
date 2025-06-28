let useCaseCounter = 1;
const useCaseTable = document.getElementById("useCaseTable").querySelector("tbody");
const useCaseSelect = document.getElementById("useCaseSelect");
const otherInput = document.getElementById("otherUseCase");

useCaseSelect.addEventListener("change", () => {
  otherInput.style.display = useCaseSelect.value === "Other" ? "block" : "none";
});

function addUseCase() {
  let selected = useCaseSelect.value;
  if (selected === "Other") {
    selected = otherInput.value.trim();
    if (!selected) {
      alert("Please enter a custom use case name.");
      return;
    }
  }

  const row = useCaseTable.insertRow();
  row.insertCell(0).innerText = `UC-${useCaseCounter.toString().padStart(3, '0')}`;
  row.insertCell(1).innerText = selected;
  useCaseCounter++;

  // Reset
  useCaseSelect.value = "User Management";
  otherInput.style.display = "none";
  otherInput.value = "";
}

function generateDoc() {
  const { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } = docx;

  const rows = Array.from(useCaseTable.rows).map(row => {
    const cells = Array.from(row.cells).map(cell => 
      new TableCell({
        children: [new Paragraph(cell.textContent)],
      })
    );
    return new TableRow({ children: cells });
  });

  const table = new Table({
    rows: [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph("Use Case ID")] }),
          new TableCell({ children: [new Paragraph("Use Case Name")] })
        ]
      }),
      ...rows
    ]
  });

  const doc = new Document({
    sections: [{ children: [new Paragraph("Use Case Table"), table] }]
  });

  Packer.toBlob(doc).then(blob => {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "UseCaseTable.docx";
    a.click();
  });
}
