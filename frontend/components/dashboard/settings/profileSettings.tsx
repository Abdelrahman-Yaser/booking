import React from 'react'
import { all_routes } from '../../router/all_routes';
import Breadcrumb from '../../../core/common/Breadcrumb/breadcrumb';
import { Link } from 'react-router-dom';
import Sidebar from '../../../core/common/sidebar/sidebar';
import ImageWithBasePath from '../../../core/common/imageWithBasePath';
import CustomSelect from '../../../core/common/commonSelect';
import { City, State } from '../../../core/common/selectOption/json/selectOption';

const ProfileSettings = () => {

    const routes = all_routes

    //Breadcrumb Data
    const breadcrumbs = [
        {
            label: 'Settings',
            link: routes.home1,
            active: false,
        },
        {
            label: 'Profile Settings',
            active: true,
        },
    ];

    return (
        <div>
          
            <>
                {/* Page Wrapper */}
                <div className="content">
                    <div className="container">
                        <div className="row">
                            {/* Sidebar */}
                            <div className="col-xl-3 col-lg-4">
                                <Sidebar />
                            </div>
                            {/* /Sidebar */}
                            {/* Profile Settings */}
                            <div className="col-xl-9 col-lg-8">
                                <div className="card settings mb-0">
                                    <div className="card-header">
                                        <h6>Settings</h6>
                                    </div>
                                    <div className="card-body pb-3">
                                        <div className="settings-link d-flex align-items-center flex-wrap">
                                            <Link to={routes.profileSettings} className="active ps-3">
                                                <i className="isax isax-user-octagon me-2" />
                                                Profile Settings
                                            </Link>
                                            <Link to={routes.securitySettings}>
                                                <i className="isax isax-shield-tick me-2" />
                                                Security
                                            </Link>
                                            <Link to={routes.notificationSettings}>
                                                <i className="isax isax-notification me-2" />
                                                Notifications
                                            </Link>
                                            <Link to={routes.integrationSettings} className="pe-3">
                                                <i className="isax isax-hierarchy me-2" />
                                                Integrations
                                            </Link>
                                        </div>
                                        {/* Settings Content */}
                                        <div className="settings-content mb-3">
                                            <h6 className="fs-16 mb-3">Basic Information</h6>
                                            <div className="row gy-2">
                                                <div className="col-lg-12">
                                                    <div className="d-flex align-items-center">
                                                        <ImageWithBasePath
                                                            src="assets/img/users/user-01.jpg"
                                                            alt="image"
                                                            className="img-fluid avatar avatar-xxl br-10 flex-shrink-0 me-3"
                                                        />
                                                        <div>
                                                            <p className="fs-14 text-gray-6 fw-normal mb-2">
                                                                Recommended dimensions are typically 400 x 400 pixels.
                                                            </p>
                                                            <div className="d-flex align-items-center">
                                                                <div className="me-2">
                                                                    <label className="upload-btn" htmlFor="fileUpload">
                                                                        Upload
                                                                    </label>
                                                                    <input
                                                                        type="file"
                                                                        id="fileUpload"
                                                                        style={{ display: "none" }}
                                                                    />
                                                                </div>
                                                                <Link
                                                                    to="#"
                                                                    className="btn btn-light btn-md"
                                                                >
                                                                    Remove
                                                                </Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div>
                                                        <label className="form-label">First Name</label>
                                                        <input type="text" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div>
                                                        <label className="form-label">Last Name</label>
                                                        <input type="text" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div>
                                                        <label className="form-label">Email</label>
                                                        <input type="email" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div>
                                                        <label className="form-label">Phone</label>
                                                        <input type="email" className="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="settings-content">
                                            <h6 className="fs-16 mb-3">Address Information</h6>
                                            <div className="row gy-2">
                                                <div className="col-lg-12">
                                                    <div>
                                                        <label className="form-label">Address</label>
                                                        <input type="text" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div>
                                                        <label className="form-label">Country</label>
                                                        <input type="text" className="form-control" />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div>
                                                        <label className="form-label">State</label>
                                                        <CustomSelect
                                                            options={State}
                                                            className="select d-flex"
                                                            placeholder="Select"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div>
                                                        <label className="form-label">City</label>
                                                        <CustomSelect
                                                            options={City}
                                                            className="select d-flex"
                                                            placeholder="Select"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div>
                                                        <label className="form-label">Postal Code</label>
                                                        <input type="text" className="form-control" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* /Settings Content*/}
                                    </div>
                                    <div className="card-footer">
                                        <div className="d-flex align-items-center justify-content-end">
                                            <Link to="#" className="btn btn-light me-2">
                                                Cancel
                                            </Link>
                                            <Link to="#" className="btn btn-primary">
                                                Save
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* /Profile Settings */}
                        </div>
                    </div>
                </div>
                {/* /Page Wrapper */}
            </>



        </div>
    )
}

export default ProfileSettings
