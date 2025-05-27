const PDFDocument = require('pdfkit');
const XLSX = require('xlsx');
const { createObjectCsvStringifier } = require('csv-writer');

exports.exportReport = async (req, res, { format, transactions, summary }) => {
    try {
        if (format === 'csv') {
            const csvStringifier = createObjectCsvStringifier({
                header: [
                    { id: 'date', title: 'Date' },
                    { id: 'title', title: 'Title' },
                    { id: 'amount', title: 'Amount' },
                    { id: 'category', title: 'Category' },
                    { id: 'description', title: 'Description' }
                ]
            });
            const csv = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(transactions);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename=\"transactions.csv\"');
            return res.send(csv);
        }

        if (format === 'xlsx') {
            const ws = XLSX.utils.json_to_sheet(transactions);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
            const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            res.setHeader('Content-Disposition', 'attachment; filename=\"transactions.xlsx\"');
            return res.send(buf);
        }

        if (format === 'pdf') {
            const doc = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename=\"transactions.pdf\"');
            doc.pipe(res);
            doc.fontSize(18).text('Financial Report', { align: 'center' });
            doc.moveDown();
            doc.fontSize(12).text(`Total Income: $${summary.totalIncome}`);
            doc.text(`Total Expenses: $${summary.totalExpenses}`);
            doc.text(`Net Savings: $${summary.netSavings}`);
            doc.text(`Savings Rate: ${summary.savingsRate.toFixed(1)}%`);
            doc.text(`Top Expense Category: ${summary.topExpenseCategory.category} $${summary.topExpenseCategory.amount}`);
            doc.moveDown();
            doc.fontSize(14).text('Transactions:');
            transactions.forEach(t => {
                doc.fontSize(10).text(`${t.date} | ${t.title} | $${t.amount} | ${t.category} | ${t.description}`);
            });
            doc.end();
            return;
        }

        res.status(400).json({ message: 'Invalid format' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to export report', error: err.message });
    }
};