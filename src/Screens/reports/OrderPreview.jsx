import { StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Accordion from '../../Components/Accordion';
import { API } from '../../Config/Endpoint';
import { customColors, typography } from '../../Config/helper';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';
import { ScrollView } from 'react-native-gesture-handler';

const OrderPreview = () => {
    const navigation = useNavigation();
    const scheme = useColorScheme();
    const colors = customColors[scheme === 'dark' ? 'dark' : 'light'];
    const [logData, setLogData] = useState([])
    const [retailerInfo, setRetailerInfo] = useState({});

    const [show, setShow] = useState(false);
    const [selectedFromDate, setSelectedFromDate] = useState(new Date());
    const [selectedToDate, setSelectedToDate] = useState(new Date());
    const [isSelectingFromDate, setIsSelectingFromDate] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const userId = await AsyncStorage.getItem('UserId');
                const Company_Id = await AsyncStorage.getItem('Company_Id');
                const fromDate = selectedFromDate.toISOString().split('T')[0];
                const toDate = selectedToDate.toISOString().split('T')[0];
                fetchSaleOrder(fromDate, toDate, userId, Company_Id)
            } catch (err) {
                console.log(err);
            }
        })();
    }, [selectedFromDate, selectedToDate])

    const selectDateFn = (event, selectedDate) => {
        setShow(Platform.OS === 'ios');
        if (selectedDate) {
            if (isSelectingFromDate) {
                setSelectedFromDate(selectedDate);
                if (selectedDate > selectedToDate) {
                    setSelectedToDate(selectedDate);
                }
            } else {
                setSelectedToDate(selectedDate);
                if (selectedDate < selectedFromDate) {
                    setSelectedFromDate(selectedDate);
                }
            }
        }
    };

    const showDatePicker = (isFrom) => {
        setShow(true);
        setIsSelectingFromDate(isFrom);
    };

    const fetchSaleOrder = async (from, to, userId, company) => {
        try {
            const response = await fetch(`${API.saleOrder}?Fromdate=${from}&Todate=${to}&Company_Id=${company}&Created_by=${userId}&Sales_Person_Id=${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();

            if (data.success === true) {
                setLogData(data.data);
            } else {
                console.log("Failed to fetch logs:", data.message);
            }
        } catch (error) {
            console.log("Error fetching logs:", error);
        }
    }

    const renderHeader = (item) => {
        return (
            <View style={styles(colors).header}>
                <Text style={styles(colors).headerText}>{item.Retailer_Name}</Text>
            </View>
        );
    };

    const renderContent = (item) => {
        const currentDate = new Date().toISOString().split('T')[0];
        const orderDate = new Date(item.So_Date).toISOString().split('T')[0];

        return (
            <View style={styles(colors).content}>
                <View style={styles(colors).invoiceContainer}>
                    <View style={styles(colors).invoiceHeader}>
                        <Text style={styles(colors).invoiceTitle}>Order Summary</Text>
                        <Text style={styles(colors).invoiceDate}>Date: {new Date(item.So_Date).toLocaleDateString()}</Text>
                    </View>
                </View>

                <View style={styles(colors).invoiceBody}>
                    <View style={styles(colors).invoiceRow}>
                        <Text style={styles(colors).invoiceLabel}>Retailer:</Text>
                        <Text style={styles(colors).invoiceValue}>{item.Retailer_Name}</Text>
                    </View>
                    <View style={styles(colors).invoiceRow}>
                        <Text style={styles(colors).invoiceLabel}>Total Invoice Value:</Text>
                        <Text style={styles(colors).invoiceValue}>₹ {item.Total_Invoice_value}</Text>
                    </View>
                    <View style={styles(colors).invoiceProducts}>
                        <Text style={styles(colors).invoiceProductsTitle}>Products:</Text>
                        <View style={styles(colors).productRowHeader}>
                            <Text style={styles(colors).productCell}>Name</Text>
                            <Text style={styles(colors).productCell}>Qty</Text>
                            <Text style={styles(colors).productCell}>Rate</Text>
                            <Text style={styles(colors).productCell}>Amount</Text>
                        </View>
                        {item.Products_List.map((product, index) => (
                            <View key={index} style={styles(colors).productRow}>
                                <Text style={styles(colors).productCell}>{product.Product_Name}</Text>
                                <Text style={styles(colors).productCell}>{product.Bill_Qty}</Text>
                                <Text style={styles(colors).productCell}>₹ {product.Item_Rate}</Text>
                                <Text style={styles(colors).productCell}>₹ {product.Amount}</Text>
                            </View>
                        ))}
                    </View>
                    <View style={styles(colors).buttonContainer}>
                        {currentDate === orderDate && (
                            <TouchableOpacity style={styles(colors).editButton} onPress={() => editOption(item)}>
                                <Text style={styles(colors).editButtonText}>Edit</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity style={styles(colors).downloadButton} onPress={() => downloadItemPDF(item)}>
                            <Text style={styles(colors).downloadButtonText}>Share PDF</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const editOption = (item) => {
        navigation.navigate('Orders', { item, isEdit: true })
    }

    useEffect(() => {
        if (logData && logData.length > 0 && logData[0].Retailer_Id) {
            fetch(`${API.retailerInfo}${logData[0].Retailer_Id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        console.log(data.data[0].Reatailer_Address);
                        setRetailerInfo(data.data[0]);
                    }
                })
                .catch(error => {
                    console.error('Error fetching retailer data:', error);
                });
        }
    }, []);

    function numberToWords(num) {
        const under20 = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
        const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
        const thousand = ['Thousand', 'Million', 'Billion'];

        if (num < 20) return under20[num];
        if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 === 0 ? '' : ' ' + under20[num % 10]);
        if (num < 1000) return under20[Math.floor(num / 100)] + ' hundred' + (num % 100 === 0 ? '' : ' ' + numberToWords(num % 100));

        for (let i = 0; i < thousand.length; i++) {
            let decimal = Math.pow(1000, i + 1);
            if (num < decimal) {
                return numberToWords(Math.floor(num / Math.pow(1000, i))) + ' ' + thousand[i - 1] + (num % Math.pow(1000, i) === 0 ? '' : ' ' + numberToWords(num % Math.pow(1000, i)));
            }
        }
        return num;
    }

    const generateItemPDF = async (item) => {
        if (!retailerInfo) {
            console.error('Retailer information is missing');
            return;
        }

        const totalAmountWords = numberToWords(item.Total_Invoice_value);

        // Wait until retailerInfo is populated before generating the PDF
        // while (!retailerInfo) {
        //     await new Promise(resolve => setTimeout(resolve, 100));
        // }

        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Sales Order</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous" />
            <style>
                .header-text {
                    font-size: 1.5rem;
                    font-weight: bold;
                }

                .address,
                .bank-details {
                    font-size: 0.9rem;
                }

                .details-text {
                    font-size: 1rem;
                }

                .table th,
                .table td {
                    vertical-align: middle;
                }

                .total-text {
                    font-size: 1.1rem;
                    font-weight: bold;
                }

                .py-3 {
                    padding-top: 1rem !important;
                    padding-bottom: 1rem !important;
                }

                .py-md-5 {
                    padding-top: 3rem !important;
                    padding-bottom: 3rem !important;
                }
            </style>
        </head>
        <body>
            <section class="py-3 py-md-5">
                <div class="container border border-black">
                    <div class="row justify-content-center">
                        <div class="col-12 col-lg-9 col-xl-8 col-xxl-7">
                            <div class="row gy-3 mb-3 align-items-center">
                                <div class="col-auto">
                                    <a href="#!" class="d-block">
                                        <img src="https://www.shrifoodsindia.com/web/image/website/1/logo/shrifoodsindia?unique=1c9d31f" class="img-fluid" alt="BootstrapBrain Logo" width="135" height="44" />
                                    </a>
                                </div>
                                <div class="col">
                                    <div class="text-center">
                                        <h4 class="mb-0">Sale Order</h4>
                                    </div>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col">
                                    <h4>From</h4>
                                    <address>
                                        <strong>${item.Branch_Name}</strong><br />
                                        153, Chitrakara Street, Valaiyal Kadai,<br />
                                        Madurai, Tamil Nadu 625001.<br />
                                        GSTIN: 33CDHPK1650E1ZZ<br />
                                        Phone: (809) 822-2822<br />
                                    </address>
                                </div>
                                <div class="col">
                                    <h4>Bill To</h4>
                                    <address>
                                        <strong>${retailerInfo.Retailer_Name}</strong><br />
                                        ${retailerInfo.Reatailer_Address} <br />
                                        ${retailerInfo.AreaGet} <br />
                                        ${retailerInfo.StateGet} - ${retailerInfo.PinCode}<br />
                                        GSTIN: ${retailerInfo.Gstno}<br />
                                        Phone: ${retailerInfo.Mobile_No}<br />
                                    </address>
                                </div>
                            </div>
                            <div class="row mb-3">
                                <div class="col-12 col-md-8">
                                    <h4>Order #Id</h4>
                                    <div>
                                        <span>Date:</span>
                                        <span>${new Date(item.So_Date).toLocaleDateString()}</span>
                                    </div>
                                    <div>
                                        <span>Order Taken:</span>
                                        <span>${item.Created_BY_Name}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <div class="table-responsive">
                                        <table class="table table-bordered">
                                            <thead>
                                                <tr class= "table-primary">
                                                    <th scope="col">Sno</th>
                                                    <th scope="col">Product</th>
                                                    <th scope="col">Quantity</th>
                                                    <th scope="col">Price</th>
                                                    <th scope="col">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody class="table-group-divider">
                                                ${item.Products_List.map((product, index) => `
                                                    <tr>
                                                        <td>${index + 1}</td>
                                                        <td>${product.Product_Name}</td>
                                                        <td>${product.Bill_Qty}</td>
                                                        <td>${product.Item_Rate}</td>
                                                        <td>₹ ${product.Amount}</td>
                                                    </tr>
                                                `).join('')}
                                                <tr>
                                                    <th scope="row" colspan="4" class="text-uppercase text-end">Total</th>
                                                    <td class="text-end">₹ ${item.Total_Invoice_value}</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row" colspan="5" class="text-start">Total Amount in Words</th>
                                                </tr>
                                                <tr>
                                                    <td colspan="5" class="text-start">${totalAmountWords}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12">
                            <p class="text-muted mt-5">
                                This is an automatically generated bill. Please verify all details before making any payments.
                            </p>
                        </div>
                    </div>
                </div>
                
            </section>
        </body>
        </html>
    `;

        const options = {
            html: htmlContent,
            fileName: 'orders',
            directory: 'Documents',
        };

        const pdf = await RNHTMLtoPDF.convert(options);
        return pdf.filePath;
    };

    const downloadItemPDF = async (item) => {
        try {
            const pdfPath = await generateItemPDF(item);
            Share.open({
                url: `file://${pdfPath}`,
                title: 'Order Preview',
                message: 'Here is your order preview in PDF format',
            });
        } catch (error) {
            console.log('Error generating PDF:', error);
        }
    };

    return (
        <View style={styles(colors).container}>
            <View style={styles(colors).datePickerContainer}>
                <View style={styles(colors).datePickerWrapper}>
                    <Text style={styles(colors).dateTitle}>From</Text>
                    <TouchableOpacity activeOpacity={0.7} style={styles(colors).datePicker} onPress={() => showDatePicker(true)}>
                        <TextInput
                            maxFontSizeMultiplier={1.2}
                            style={styles(colors).textInput}
                            value={selectedFromDate ? new Intl.DateTimeFormat('en-GB').format(selectedFromDate) : ''}
                            editable={false}
                            placeholder='Select Date'
                        />
                        <Icon name="calendar" color={colors.accent} size={20} />
                    </TouchableOpacity>
                </View>

                <View style={styles(colors).datePickerWrapper}>
                    <Text style={styles(colors).dateTitle}>To</Text>
                    <TouchableOpacity activeOpacity={0.7} style={styles(colors).datePicker} onPress={() => showDatePicker(false)}>
                        <TextInput
                            maxFontSizeMultiplier={1.2}
                            style={styles(colors).textInput}
                            value={selectedToDate ? new Intl.DateTimeFormat('en-GB').format(selectedToDate) : ''}
                            editable={false}
                        />
                        <Icon name="calendar" color={colors.accent} size={20} />
                    </TouchableOpacity>
                </View>

                {show && (
                    <DateTimePicker
                        value={isSelectingFromDate ? selectedFromDate : selectedToDate}
                        onChange={selectDateFn}
                        mode="date"
                        display="default"
                        timeZoneOffsetInMinutes={0}
                        style={{ width: '100%' }}
                        testID="dateTimePicker"
                    />
                )}
            </View>

            <ScrollView style={styles(colors).scrollContainer}>
                <Accordion
                    data={logData}
                    renderHeader={renderHeader}
                    renderContent={renderContent}
                />
            </ScrollView>

        </View>
    )
}

export default OrderPreview

const styles = (colors) => StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    datePickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 15,
        justifyContent: 'space-between',
    },
    datePickerWrapper: {
        flex: 1,
        marginRight: 10,
        minWidth: 100,
        maxWidth: 250,
    },
    dateTitle: {
        ...typography.body1(colors),
        color: colors.text,
        marginBottom: 5,
    },
    datePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.accent,
        borderRadius: 5,
        paddingHorizontal: 10,
        height: 50,
        justifyContent: 'space-between',
    },
    textInput: {
        ...typography.body1(colors),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.primary,
    },
    headerText: {
        ...typography.body1(colors),
        fontWeight: '500',
    },
    content: {
        margin: 10,
        borderRadius: 10,
        overflow: 'hidden',
        borderColor: colors.border,
        borderWidth: 1,
    },
    invoiceContainer: {
        padding: 10,
        backgroundColor: colors.card,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    invoiceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    invoiceTitle: {
        ...typography.h6(colors),
        fontWeight: 'bold',
    },
    invoiceDate: {
        ...typography.body1(colors),
    },
    invoiceBody: {
        padding: 10,
        backgroundColor: colors.background,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    invoiceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    invoiceLabel: {
        ...typography.h6(colors),
    },
    invoiceValue: {
        ...typography.body1(colors),
    },
    invoiceProducts: {
        marginTop: 10,
    },
    invoiceProductsTitle: {
        ...typography.h6(colors),
        marginBottom: 5,
    },
    productRowHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.card,
        paddingVertical: 5,
        borderRadius: 5,
    },
    productRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    productCell: {
        width: '25%',
        textAlign: 'center',
        ...typography.body1(colors),
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    editButton: {
        backgroundColor: colors.secondary,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 20,
    },
    editButtonText: {
        ...typography.h6(colors),
        fontWeight: '700'
    },
    downloadButton: {
        padding: 10,
        backgroundColor: colors.secondary,
        borderRadius: 5,
    },
    downloadButtonText: {
        ...typography.h6(colors),
        fontWeight: '700',
        color: colors.white,
    },
    downloadButton: {
        backgroundColor: colors.primary,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 20,
    },
    scrollContainer: {
        marginTop: 15,
        marginBottom: 100,
    },
})