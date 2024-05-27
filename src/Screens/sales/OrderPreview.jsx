import { StyleSheet, Text, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Accordion from '../../Components/Accordion';
import { API } from '../../Config/Endpoint';
import { customColors, customFonts, typography } from '../../Config/helper';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePicker from '@react-native-community/datetimepicker';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import Share from 'react-native-share';

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
        console.log(`${API.saleOrder}?Fromdate=${from}&Todate=${to}&Company_Id=${company}&Created_by=${userId}&Sales_Person_Id=${userId}`)
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
                            <Text style={styles(colors).downloadButtonText}>Download PDF</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    };

    const editOption = (item) => {
        // console.log(item)
        navigation.navigate('Orders', { item, isEdit: true })
    }

    useEffect(() => {
        if (logData.Retailer_Id) {
            console.log(`${API.retailerInfo}${logData.Retailer_Id}`)
            fetch(`${API.retailerInfo}${logData.Retailer_Id}`)
        }
    }, [])

    const generateItemPDF = async (item) => {
        let htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>Sales Order</title>
                <link
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
                    rel="stylesheet"
                    integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
                    crossorigin="anonymous"
                />
                <style>
                    .header-text {
                        font-size: 1.5rem;
                        font-weight: bold;
                    }
                    .address, .bank-details {
                        font-size: 0.9rem;
                    }
                    .details-text {
                        font-size: 1rem;
                    }
                    .table th, .table td {
                        vertical-align: middle;
                    }
                    .total-text {
                        font-size: 1.1rem;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <img src="https://www.shrifoodsindia.com/web/image/website/1/logo/shrifoodsindia?unique=1c9d31f" 
                    class="img-fluid mx-auto d-block"
                >
                <div class="container mt-4">
                    <div class="row">
                        <div class="col-sm-6">
                            <h1 class="header-text">${item.Branch_Name}</h1>
                            <p class="address">Madurai - Tamilnadu</p>
                        </div>
                        <div class="col-sm-6 text-end">
                            <table className='table mb-0'>
                                <tbody>
                                     <tr>
                                        <td className='border-0 p-1'>GST</td>
                                        <td className='border-0 p-1'>-</td>
                                    </tr>
                                    <tr>
                                        <td className='border-0 p-1'>Account No</td>
                                        <td className='border-0 p-1'>-</td>
                                    </tr>
                                    <tr>
                                        <td className='border-0 p-1'>IFSC</td>
                                        <td className='border-0 p-1'>-</td>
                                    </tr>
                                    <tr>
                                        <td className='border-0 p-1'>Bank</td>
                                        <td className='border-0 p-1'>-</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <hr />
                    <div class="row">
                        <div class="col-sm-6">
                            <p class="details-text">Retailer: ${item.Retailer_Name}</p>
                        </div>
                        <div class="col-sm-6 text-end">
                            <p class="details-text">Date: ${new Date(item.So_Date).toLocaleDateString()}</p>
                            <p class="details-text">Order taken by: ${item.Created_BY_Name}</p>
                        </div>
                    </div>
                    <hr />
                    <table class="table">
                        <thead>
                            <tr class="table-primary">
                                <th>Sno</th>
                                <th>Product</th>
                                <th>Quantity</th>
                                <th>Rate</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
    `;

        item.Products_List.forEach((product, index) => {
            htmlContent += `
            <tr>
                <td>${index + 1}</td>
                <td>${product.Product_Name}</td>
                <td>${product.Bill_Qty}</td>
                <td>₹ ${product.Item_Rate}</td>
                <td>₹ ${product.Amount}</td>
            </tr>
        `;
        });

        htmlContent += `
                        </tbody>
                    </table>
                    <p class="text-end total-text">Total: ₹ ${item.Total_Invoice_value}</p>
                </div>
            </body>
        </html>
    `;

        const options = {
            html: htmlContent,
            fileName: 'orderPreview',
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
        <View style={styles.container}>
            <View style={styles(colors).datePickerContainer}>
                <View style={styles(colors).datePickerWrapper}>
                    <Text style={styles(colors).dateTitle}>From</Text>
                    <TouchableOpacity activeOpacity={0.7} style={styles(colors).datePicker} onPress={() => showDatePicker(true)}>
                        <TextInput
                            maxFontSizeMultiplier={1.2}
                            style={styles(colors).textInput}
                            value={selectedFromDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
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
                            value={selectedToDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
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

            <Accordion data={logData} renderHeader={renderHeader} renderContent={renderContent} />
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
        marginHorizontal: 20,
    },
    dateTitle: {
        ...typography.body1(colors),
        color: colors.text,
        marginBottom: 5,
    },
    datePickerWrapper: {
        flex: 1,
        marginRight: 10,
        marginVertical: 15,
        minWidth: 100, // Minimum width
        maxWidth: 250,
    },
    datePicker: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.accent,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: customColors.primary,
    },
    headerText: {
        fontSize: 16,
        fontFamily: customFonts.plusJakartaSansMedium,
        color: customColors.text,
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
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.text,
    },
    invoiceDate: {
        fontSize: 14,
        color: colors.text,
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
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.text,
    },
    invoiceValue: {
        fontSize: 16,
        color: colors.text,
    },
    invoiceProducts: {
        marginTop: 10,
    },
    invoiceProductsTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: colors.text,
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
        color: colors.text,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    editButton: {
        backgroundColor: customColors.secondary,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 20,
    },
    editButtonText: {
        color: customColors.black,
        fontSize: 16,
        fontFamily: customFonts.plusJakartaSansBold,
    },
    downloadButton: {
        padding: 10,
        backgroundColor: colors.secondary,
        borderRadius: 5,
    },
    downloadButtonText: {
        color: customColors.white,
        fontSize: 16,
        fontFamily: customFonts.plusJakartaSansBold,
    },
    downloadButton: {
        backgroundColor: customColors.primary,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginVertical: 20,
    },
    contentInner: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 5,
        borderBottomWidth: 0.75,
        borderBottomColor: customColors.black,
    },
    cell: {
        textAlign: 'center',
        flexWrap: 'wrap',
    },
    cell: {
        flex: 2,
        textAlign: 'center',
        flexWrap: 'wrap',
    },
    cellHead: {
        fontFamily: customFonts.plusJakartaSansBold,
        fontSize: 14,
        fontWeight: '500'
    },
})