// Make sure to include docx library in your HTML, e.g. via <script src="https://unpkg.com/docx@8.0.2/build/index.umd.js"></script>

let useCaseCounter = 1;
const useCaseTable = document.getElementById("useCaseTable").querySelector("tbody");
const useCaseSelect = document.getElementById("useCaseSelect");
const otherInput = document.getElementById("otherUseCase");

useCaseSelect.addEventListener("change", () => {
  otherInput.style.display = useCaseSelect.value === "Other" ? "block" : "none";
});

function addUseCase() {
  let selected = useCaseSelect.value;
  let isCustom = selected === "Other";

  // Handle custom input validation
  if (isCustom) {
    selected = otherInput.value.trim();
    if (!selected) {
      alert("Please enter a custom use case name.");
      return;
    }
  }

  // Prevent duplicates for standard options
  if (!isCustom) {
    // Disable selected option in dropdown
    const selectedOption = useCaseSelect.querySelector(`option[value="${useCaseSelect.value}"]`);
    if (selectedOption) selectedOption.disabled = true;
  }

  // Add row to table
  const row = useCaseTable.insertRow();
  row.insertCell(0).innerText = `UC-${useCaseCounter.toString().padStart(3, '0')}`;
  row.insertCell(1).innerText = selected;
  useCaseCounter++;

  // Reset UI
  useCaseSelect.value = "User Management";
  otherInput.style.display = "none";
  otherInput.value = "";
}

function generateDoc() {
  // 'docx' must be available globally (e.g. via script tag)
  const { Document, Packer, Paragraph, Table, TableRow, TableCell } = docx;

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
