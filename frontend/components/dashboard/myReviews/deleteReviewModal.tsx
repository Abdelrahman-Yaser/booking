import React from 'react'
import { Link } from 'react-router-dom'

const DeleteReviewModal = () => {
    return (
        <div>
            <>
                {/* Delete Modal */}
                <div className="modal fade" id="delete_modal">
                    <div className="modal-dialog modal-dialog-centered modal-sm">
                        <div className="modal-content">
                            <div className="modal-body">
                                <form>
                                    <div className="text-center">
                                        <h5 className="mb-3">Delete Review</h5>
                                        <p className="mb-3">
                                            Are you sure you want to delete this review?
                                        </p>
                                        <div className="d-flex align-items-center justify-content-center">
                                            <Link
                                                to="#"
                                                className="btn btn-light me-2"
                                                data-bs-dismiss="modal"
                                            >
                                                No
                                            </Link>
                                            <Link to="#" data-bs-dismiss="modal" className="btn btn-primary">
                                                Yes
                                            </Link>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* /Delete Modal */}
            </>

        </div>
    )
}

export default DeleteReviewModal
