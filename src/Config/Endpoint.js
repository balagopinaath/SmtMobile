const baseURL = "http://shrifoodsapi.erpsmt.in/"
// const baseURL = "http://192.168.1.3:9001/"

export const API = {
    login: 'https://erpsmt.in/user/api/login',     // build time endpoint
    // login: 'https://api.smttask.in/user/api/login',    // test endpoint
    // login: 'http://192.168.1.3:7001/user/api/login',
    changePassword: 'http://192.168.1.3:7001/user/api/users/changePassword',
    delete: baseURL + 'api/deleteMyAccount',

    attendance: baseURL + 'api/attendance',
    MyLastAttendance: baseURL + 'api/getMyLastAttendance?UserId=',
    myTodayAttendance: baseURL + 'api/myTodayAttendance?UserId=',
    attendanceHistory: baseURL + 'api/myAttendanceHistory?',

    retailers: baseURL + 'api/masters/retailers?Company_Id=',
    retailerName: baseURL + 'api/masters/retailers/dropDown?Company_Id=',
    retailerLocation: baseURL + 'api/masters/retailerLocation',
    areaRetailers: baseURL + 'api/masters/retailers/areaRetailers?Company_Id=',
    retailerInfo: baseURL + 'api/masters/retailers/retaileDetails?Retailer_Id=',

    routes: baseURL + 'api/masters/routes',
    areas: baseURL + 'api/masters/areas',
    state: baseURL + 'api/masters/state',
    distributors: baseURL + 'api/masters/distributors',

    groupedProducts: baseURL + 'api/masters/products/grouped?Company_Id=',
    productClosingStock: baseURL + 'api/masters/retailers/productClosingStock?Retailer_Id=',
    closingStock: baseURL + 'api/masters/retailers/closingStock',
    closingStockReport: baseURL + 'api/masters/retailers/closingStock/myEntry?UserId=',

    saleOrder: baseURL + 'api/sales/saleOrder',
    productPacks: baseURL + 'api/masters/products/packs?Company_Id=',
    productGroups: baseURL + 'api/masters/products/productGroups?Company_Id=',

    visitedLog: baseURL + 'api/visitedPlaces',

    google_map: 'https://www.google.com/maps/search/?api=1&query=',
    whatsApp: 'https://wa.me/+91',
}
