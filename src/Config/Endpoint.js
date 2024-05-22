const baseURL = "http://shrifoodsapi.erpsmt.in/"
// const baseURL = "http://192.168.1.2:9001/"

export const API = {
    login: baseURL + 'api/login',

    attendance: baseURL + 'api/attendance',
    MyLastAttendance: baseURL + 'api/getMyLastAttendance?UserId=',
    myTodayAttendance: baseURL + 'api/myTodayAttendance?UserId=',
    attendanceHistory: baseURL + 'api/myAttendanceHistory?',

    retailers: baseURL + 'api/masters/retailers?Company_Id=',
    retailerName: baseURL + 'api/masters/retailers/dropDown?Company_Id=',
    retailerLocation: baseURL + 'api/masters/retailerLocation',
    areaRetailers: baseURL + 'api/masters/retailers/areaRetailers?Company_Id=',

    routes: baseURL + 'api/masters/routes',
    areas: baseURL + 'api/masters/areas',
    state: baseURL + 'api/masters/state',
    distributors: baseURL + 'api/masters/distributors',

    groupedProducts: baseURL + 'api/masters/products/grouped?Company_Id=',
    productClosingStock: baseURL + 'api/masters/retailers/productClosingStock?Retailer_Id=',
    closingStock: baseURL + 'api/masters/retailers/closingStock',
    closingStockReport: baseURL + 'api/masters/retailers/closingStock/myEntry?UserId=',

    saleOrder: baseURL + 'api/sales/saleOrder',

    visitedLog: baseURL + 'api/visitedPlaces',

    google_map: 'https://www.google.com/maps/search/?api=1&query=',
    whatsApp: 'https://wa.me/+91',
}
