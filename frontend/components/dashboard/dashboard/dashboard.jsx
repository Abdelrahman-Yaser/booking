'use client'

import React, { useState } from 'react'
import Link from 'next/link';
import Image from 'next/image';
import ReactApexChart from "react-apexcharts";
import Sidebar from '../Sidebar';

const Dashboard = () => {

    const [toursChart] = useState({
        series: [76, 67, 61, 90],
        options: {
          chart: {
            height: 283,
            type: 'radialBar',
          },
          plotOptions: {
            radialBar: {
              offsetY: 0,
              startAngle: 0,
              endAngle: 270,
              hollow: {
                margin: 5,
                size: '30%',
                background: 'transparent',
                image: undefined,
              },
              dataLabels: {
                name: {
                  show: false,
                },
                value: {
                  show: false,
                }
              },
              barLabels: {
                enabled: true,
                useSeriesColors: true,
                offsetX: -8,
                fontSize: '16px',
                formatter: function(seriesName, opts) {
                  return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
                },
              },
            }
          },
          colors: ['#155EEF', '#212E47', '#98AA30', '#CF3425'],
          labels: ['Hotels', 'Cars', 'Tours', 'Flights'],
          responsive: [{
            breakpoint: 480,
            options: {
              legend: {
                  show: false
              }
            }
          }]
        },
    });
   
    const [chartOptions] = useState({
        chart: {
            height: 250,
            type: "bar",
            stacked: true,
            toolbar: {
                show: false,
            },
        },
        colors: ["#CF3425", "#FEEDEB"],
        responsive: [
            {
                breakpoint: 480,
                options: {
                    legend: {
                        position: "bottom",
                        offsetX: -10,
                        offsetY: 0,
                    },
                },
            },
        ],
        plotOptions: {
            bar: {
                borderRadius: 5,
                horizontal: false,
                endingShape: "rounded",
            },
        },
        series: [
            {
                name: "Income",
                data: [5000, 16000, 8000, 5000, 4000, 5000, 12000, 5000, 8000, 5000, 5000, 8000],
            },
            {
                name: "Expenses",
                data: [5000, 4000, 4000, 5000, 8000, 5000, 4000, 5000, 4000, 5000, 5000, 4000],
            },
        ],
        xaxis: {
            categories: [
                "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            ],
            labels: {
                style: {
                    colors: "#4E5561",
                    fontSize: "12px",
                },
            },
        },
        yaxis: {
            labels: {
                formatter: (val) => `${val / 1000}K`,
                offsetX: -15,
                style: {
                    colors: "#4E5561",
                    fontSize: "13px",
                },
            },
        },
        grid: {
            show: false,
        },
        legend: {
            show: false,
        },
        dataLabels: {
            enabled: false,
        },
        fill: {
            opacity: 1,
        },
    });

    return (
        <div>
            {/* Page Wrapper */}
            <div className="content content-two">
                <div className="container">
                    <div className="row">
                        {/* Sidebar */}
                        <div className="col-xl-3 col-lg-4 ">
                            <Sidebar />
                        </div>
                        {/* /Sidebar */}
                        <div className="col-xl-9 col-lg-8">
                            <div className="alert alert-teal alert-dismissible d-flex align-items-center border-0 mb-4 fade show">
                                <i className="isax isax-info-circle5 me-2" /> Reminder about your
                                upcoming booking Hotel Hayat on 15 May 2025 at 09:30 AM . We look
                                forward to seeing you!
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="alert"
                                    aria-label="Close"
                                >
                                    <i className="fas fa-xmark" />
                                </button>
                            </div>
                            <div className="row">
                                <div className="col-xl-4">
                                    <div className="card shadow-none">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center">
                                                <span className="avatar avatar-xl rounded-circle bg-primary me-3">
                                                    <i className="isax isax-calendar-15 fs-36" />
                                                </span>
                                                <div>
                                                    <h3>80</h3>
                                                    <p>Total Bookings</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4">
                                    <div className="card shadow-none">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center">
                                                <span className="avatar avatar-xl rounded-circle bg-secondary me-3">
                                                    <i className="isax isax-money-send5 fs-36" />
                                                </span>
                                                <div>
                                                    <h3>$5.3K</h3>
                                                    <p>Total Transactions</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-4">
                                    <div className="card shadow-none">
                                        <div className="card-body">
                                            <div className="d-flex align-items-center">
                                                <span className="avatar avatar-xl rounded-circle bg-purple me-3">
                                                    <i className="isax isax-money-tick5 fs-36" />
                                                </span>
                                                <div>
                                                    <h3>$5965</h3>
                                                    <p>Average Value</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Charts and Statistics Section */}
                            <div className="row">
                                <div className="col-xl-7 d-flex">
                                    <div className="card shadow-none flex-fill">
                                        <div className="card-body pb-0">
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <h6>Recent Bookings</h6>
                                                <div className="dropdown">
                                                    <Link
                                                        href="#"
                                                        className="dropdown-toggle btn bg-light-200 btn-sm text-gray-6 rounded-pill fw-normal fs-14 d-inline-flex align-items-center"
                                                        data-bs-toggle="dropdown"
                                                    >
                                                        <i className="isax isax-calendar-2 me-2 fs-14 text-gray-6" />
                                                        2025
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="mb-2">
                                                    <p className="mb-0">Spending For Bookings</p>
                                                    <div className="d-flex align-items-center">
                                                        <h3 className="me-2">$20,659</h3>
                                                        <p className="fs-14">
                                                            <span className="badge badge-soft-success badge-md border border-success rounded-pill me-2">
                                                                <i className="isax isax-arrow-up-3 " />
                                                                12%
                                                            </span>
                                                            vs last years
                                                        </p>
                                                    </div>
                                                </div>
                                                <div id="transcation_chart" />
                                                <ReactApexChart
                                                    options={chartOptions}
                                                    series={chartOptions.series}
                                                    type="bar"
                                                    height={250}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="col-xl-5 d-flex">
                                    <div className="card shadow-none flex-fill">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <h6>Bookings Statistics</h6>
                                            </div>
                                            <div className="row">
                                                <div className="mb-0">
                                                    <p className="mb-0">Total Amount Spend</p>
                                                    <h3>$2659</h3>
                                                </div>
                                                <div id="tours_chart" />
                                                <ReactApexChart
                                                   options={toursChart.options}
                                                    series={toursChart.series}
                                                    type="radialBar"
                                                    height={280}
                                                />
                                                <p className="fs-14">
                                                    <span className="text-success">+21 %</span> increased
                                                    Compared to Last year
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Most Booked Services */}
                            <div className="row">
                                <div className="col-xl-6 col-xxl-5 d-flex">
                                    <div className="card shadow-none flex-fill">
                                        <div className="card-body">
                                            <h6 className="mb-4">Most Booked Services</h6>
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <div className="d-flex align-items-center">
                                                    <Link
                                                        href="/flight-details"
                                                        className="avatar avatar-lg flex-shrink-0 me-2"
                                                    >
                                                        <Image
                                                            src="/img/flight/flight-01.jpg"
                                                            width={50}
                                                            height={50}
                                                            className="img-fluid rounded-circle"
                                                            alt="Flight"
                                                        />
                                                    </Link>
                                                    <div>
                                                        <h6 className="fs-16">
                                                            <Link href="/flight-details">Cloudrider 789</Link>{" "}
                                                            <span className="badge badge-soft-teal badge-xs rounded-pill">
                                                                <i className="isax isax-signpost me-1" />
                                                                Flight
                                                            </span>
                                                        </h6>
                                                        <p className="fs-14">Last Booked : 25 Apr 2025</p>
                                                    </div>
                                                </div>
                                                <Link
                                                    href="/flight-details"
                                                    className="btn rebook-btn btn-sm"
                                                >
                                                    <i className="isax isax-calendar-add5 me-1" />
                                                    Rebook
                                                </Link>
                                            </div>
                                            
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <div className="d-flex align-items-center">
                                                    <Link
                                                        href="/hotel-details"
                                                        className="avatar avatar-lg flex-shrink-0 me-2"
                                                    >
                                                        <Image
                                                            src="/img/hotels/hotel-21.jpg"
                                                            width={50}
                                                            height={50}
                                                            className="img-fluid rounded-circle"
                                                            alt="Hotel"
                                                        />
                                                    </Link>
                                                    <div>
                                                        <h6 className="fs-16">
                                                            <Link href="/hotel-details">The Luxe Haven</Link>{" "}
                                                            <span className="badge badge-soft-info badge-xs rounded-pill">
                                                                <i className="isax isax-signpost me-1" />
                                                                Hotel
                                                            </span>
                                                        </h6>
                                                        <p className="fs-14">Last Booked : 16 May 2025</p>
                                                    </div>
                                                </div>
                                                <Link
                                                    href="/hotel-details"
                                                    className="btn rebook-btn btn-sm"
                                                >
                                                    <i className="isax isax-calendar-add5 me-1" />
                                                    Rebook
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard 