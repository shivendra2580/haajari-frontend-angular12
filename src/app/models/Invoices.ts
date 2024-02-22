export class Invoices{

    id: number = 0;
    invoiceNo: string = '';
    planName:string = '';
    createdDate: Date = new Date();
    fromDate: Date = new Date();
    toDate: Date = new Date();
    amount: number = 0;
    taxAmount: number = 0;
    taxPercent: number = 0;
    payableAmount: number = 0;
    transactionId: string = '';
    paymentDate: Date = new Date();
    paymentMode: string = '';
    invoiceUrl: string = '';
    invoiceType: string = '';
    remark: string = '';
}