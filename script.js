document.addEventListener("DOMContentLoaded", function () {
  // Set current date in invoice date field
  const today = new Date();
  document.getElementById("invoiceDate").value =
    today.toLocaleDateString("en-CA");

  // Function to add a new row to the invoice table
  window.addInvoiceItem = function () {
    const table = document.getElementById("invoiceItems");
    const row = table.insertRow();

    // Create cells
    const serialNumberCell = row.insertCell(0);
    const descriptionCell = row.insertCell(1);
    const quantityCell = row.insertCell(2);
    const unitPriceCell = row.insertCell(3);
    const netAmountCell = row.insertCell(4);
    const taxRateCell = row.insertCell(5);
    const taxTypeCell = row.insertCell(6);
    const taxAmountCell = row.insertCell(7);
    const totalCell = row.insertCell(8);
    const actionsCell = row.insertCell(9);

    // Add inputs to the cells
    serialNumberCell.textContent = table.rows.length; // Serial number
    descriptionCell.innerHTML =
      '<input type="text" class="form-control description" placeholder="Enter description" required>';
    quantityCell.innerHTML =
      '<input type="number" class="form-control quantity" placeholder="Enter quantity" required>';
    unitPriceCell.innerHTML =
      '<input type="number" class="form-control unit-price" placeholder="Enter unit price" required>';
    netAmountCell.innerHTML =
      '<input type="text" class="form-control net-amount" readonly>';
    taxRateCell.innerHTML = "5%";
    taxTypeCell.innerHTML = "SGST/CGST";
    taxAmountCell.innerHTML =
      '<input type="text" class="form-control tax-amount" readonly>';
    totalCell.innerHTML =
      '<input type="text" class="form-control total-amount" readonly>';
    actionsCell.innerHTML =
      '<button type="button" class="btn btn-danger btn-delete" onclick="deleteInvoiceItem(this)">Delete</button>';

    // Add event listeners for quantity and unit price changes
    row.querySelector(".quantity").addEventListener("input", updateAmounts);
    row.querySelector(".unit-price").addEventListener("input", updateAmounts);
  };

  // Function to update amounts
  function updateAmounts() {
    const rows = document.querySelectorAll("#invoiceItems tr");
    let totalAmount = 0;

    rows.forEach((row, index) => {
      row.cells[0].textContent = index + 1; // Update serial number
      const quantity = row.querySelector(".quantity").value || 0;
      const unitPrice = row.querySelector(".unit-price").value || 0;
      const netAmount = quantity * unitPrice;
      const taxAmount = netAmount * 0.05;
      const totalRowAmount = netAmount + taxAmount;

      row.querySelector(".net-amount").value = netAmount.toFixed(2);
      row.querySelector(".tax-amount").value = taxAmount.toFixed(2);
      row.querySelector(".total-amount").value = totalRowAmount.toFixed(2);

      totalAmount += totalRowAmount;
    });

    document.getElementById("totalAmount").value = totalAmount.toFixed(2);
  }

  // Function to delete a row from the invoice table
  window.deleteInvoiceItem = function (btn) {
    const row = btn.closest("tr");
    row.remove();
    updateAmounts();
  };

  // Function to print the invoice
  window.printInvoice = function () {
    window.print();
  };

  // Event listener for the "Generate Invoice" button
  document
    .getElementById("generateInvoiceBtn")
    .addEventListener("click", function (event) {
      event.preventDefault();
      generateInvoice();
    });

  // Function to generate the invoice
  function generateInvoice() {
    // Update amounts before generating the invoice
    updateAmounts();

    const customerName = document.getElementById("customerName").value;
    const invoiceDate = document.getElementById("invoiceDate").value;
    const billingAddress = document.getElementById("billingAddress").value;
    const shippingAddress = document.getElementById("shippingAddress").value;
    const totalAmount = document.getElementById("totalAmount").value;

    // Validate form fields
    if (!customerName || !billingAddress || !shippingAddress || !totalAmount) {
      alert("Please fill out all required fields.");
      return;
    }

    // Capture table data
    let tableData = "";
    const rows = document.querySelectorAll("#invoiceItems tr");
    rows.forEach((row) => {
      const cells = row.cells;
      const serialNumber = cells[0].textContent;
      const description = cells[1].querySelector(".description").value;
      const quantity = cells[2].querySelector(".quantity").value;
      const unitPrice = cells[3].querySelector(".unit-price").value;
      const netAmount = cells[4].querySelector(".net-amount").value;
      const taxAmount = cells[7].querySelector(".tax-amount").value;
      const total = cells[8].querySelector(".total-amount").value;

      tableData += `
          <tr>
            <td style="text-align:center">${serialNumber}</td>
            <td style="text-align:center">${description}</td>
            <td style="text-align:center">${quantity}</td>
            <td style="text-align:center">${unitPrice}</td>
            <td style="text-align:center">${netAmount}</td>
            <td style="text-align:center">5%</td>
            <td style="text-align:center">GST</td>
            <td style="text-align:center">${taxAmount}</td>
            <td style="text-align:center">${total}</td>
          </tr>`;
    });

    let invoiceContent = `
        <div class="invoice-content" style="position:relative;background-color:#eee4e4">
          <h2 style="text-align:center;font-size:25px">Invoice</h2>
        <div class="logo" style="position:absolute;object-fit:cover
        max-width:100px;max-height:100px;top:10px;right:20px">
          <img src="/images/logoipsum-211.jpg" alt="Logo" 
          style="max-width:200px;max-height:300px" />
        </div>
          <p><strong>Customer Name:</strong> ${customerName}</p>
          <p><strong>Invoice Date:</strong> ${invoiceDate}</p>
          <div class="address-section">
            <div>
              <p><strong>Billing Address:</strong></p>
              <p>${billingAddress}</p>
            </div>
            <div>
              <p><strong>Shipping Address:</strong></p>
              <p>${shippingAddress}</p>
            </div>
          </div>
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Order No.</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Net Amount</th>
                <th>Tax Rate</th>
                <th>Tax Type</th>
                <th>Tax Amount</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${tableData}
            </tbody>
          </table>
          <div class="total-section">
            <p><strong>Total Amount:</strong> ${totalAmount}</p>
          </div>
          <div class="signature">
            <div>
             <div style="border:2px solid black;height:60px;width:150px"></div>
              <p>Signature</p>
            </div>
          </div>
        </div>`;

    const invoiceWindow = window.open("", "PRINT", "height=800,width=1200");
    invoiceWindow.document.write(`<html><head><title>Invoice</title><style>
          body { background-color: #fff; color: #000; font-family: Arial, sans-serif; }
          .invoice-content { padding: 20px; border: 1px solid #000; }
          .table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .table th, .table td { border: 1px solid #000; padding: 8px; }
          .address-section { display: flex; margin-bottom: 10px; }
          .address-section > div { flex: 1; }
          .total-section { margin-top: 20px; }
          .signature { margin-top: 50px; }
          </style></head><body>${invoiceContent}</body></html>`);
    invoiceWindow.document.close();
    invoiceWindow.print();
  }
});
