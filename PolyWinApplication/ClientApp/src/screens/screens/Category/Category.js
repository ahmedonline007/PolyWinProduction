﻿import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import actions from '../../redux/actions';
import { bindActionCreators } from "redux";
import { Form, Modal, Spinner, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Confirme from '../Confirme/Confirme';
import ReactTable from '../renderData/renderData';
import toastr from 'toastr';
import { Formik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import '../../Design/CSS/custom.css';

// validation of field
const schema = Yup.object({
    categoryName: Yup.string().required("برجاء إدخال القسم الفرعى"),
    // categoryGalleryName: Yup.string().required("برجاء الأختيار نوع الملف"),
});


class Category extends Component {

    constructor(props) {

        super(props);

        let userType = JSON.parse(localStorage.getItem("UserType"));

        if (userType !== 1) {
            toastr.error("عفوا ليس لديك صلاحية لهذة الصفحة");
            this.props.history.push("/System/DashBoard");
        }

        // this is columns of Department
        this.cells = [
            {
                Header: "",
                id: "checkbox",
                accessor: "",
                Cell: (rowInfo) => {
                    return (
                        <div>
                            <Form.Check
                                checked={this.state.selected.indexOf(rowInfo.original.id) > -1}
                                onChange={() => this.toggleRow(rowInfo.original.id)} />
                        </div>
                    );
                },
                sortable: false,
                width: 250
            },
            {
                Header: <strong> القسم العام </strong>,
                accessor: 'typeOfCategoryName',
                width: 220,
                filterable: true,
            },
            {
                Header: <strong> القسم الفرعى</strong>,
                accessor: 'categoryName',
                width: 220,
                filterable: true,
            }
        ];

        // initial value of state

        this.state = {
            selected: [],
            isLoading: false,
            showConfirme: false,
            name: "",
            id: 0,
            show: false,
            showImage: false,
            objCategory: {
                Id: 0,
                categoryName: "",
                typeOfCategory: ""
            }
        }
    }

    // life cycle of react calling when any change of props
    componentWillReceiveProps(nextState, prevState) {
        if (nextState.listCategory && nextState.listCategory.length > 0) {
            this.setState({
                isLoading: false,
                show: false
            });
        } else {
            this.setState({
                isLoading: false,
                show: false
            });
        }
    };

    // life cycle of react calling when page is loading
    componentDidMount() {
        this.props.actions.getAllParentProductCategoryForDrop();
        this.props.actions.getAllCategory();
    }

    // this function when add new data and view modal
    showModal() {
        this.setState({
            show: true,
            objCategory: {
                Id: 0,
                categoryName: "",
                typeOfCategory: ""
            }
        });
    }

    showDeleteModal() {
        this.setState({
            showConfirme: true
        });
    }

    // this function when close modal
    handleClose() {
        this.setState({
            show: false,
            showImage: false,
            showConfirme: false
        });
    }

    // this function when submit Delete item
    handleConfirm = () => {
        this.setState({
            showConfirme: false,
            selected: []
        });

        this.props.actions.deleteCategory(this.state.selected);
    }

    // this function when leave from page
    componentWillUnmont() {
        this.setState({
            show: false,
            isLoading: false,
            showConfirme: false
        });
    }

    toggleRow(id) {
        const isAdd = this.state.selected.indexOf(id);

        let newSelected = this.state.selected;

        if (isAdd > -1) {
            newSelected.splice(isAdd, 1);
        } else {

            newSelected.push(id);
        }

        this.setState({
            selected: newSelected
        });
    }

    editCategoryGallery = (state, rowInfo, column, instance) => {

        const { selection } = this.state;
        return {
            onClick: (e, handleOriginal) => {
                if (e.target.type !== "checkbox" && (e.target.className === "Edit" || e.target.className === "rt-td")) {
                    let obj = this.state.objCategory;

                    obj.typeOfCategory = { value: rowInfo.original.typeOfCategoryId, label: rowInfo.original.typeOfCategoryName };
                    obj.categoryName = rowInfo.original.categoryName;
                    obj.Id = rowInfo.original.id;

                    this.setState({
                        objCategory: obj,
                        show: true
                    });
                }
            }
        };
    };

    addEditCategoryGallery = (value) => {
        this.setState({
            isLoading: true
        });

        let obj = {};
        obj.id = value.Id;
        obj.typeOfCategory = value.typeOfCategory.value;
        obj.categoryName = value.categoryName;

        this.props.actions.addeditCategory(obj);
    }

    render() {
        return (
            <div className="content-page">
                <div className="content">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-xl-12">
                                <div className="breadcrumb-holder">
                                    <h1 className="main-title float-left">أقسام المنتجات</h1>
                                    <div className="clearfix"></div>
                                </div>
                            </div>
                        </div>
                        <div className="page-title-actions">
                            <Button size="lg" onClick={this.showModal.bind(this)}>إضافة</Button>
                            {this.state.selected.length > 0 ?
                                <Button size="lg" onClick={this.showDeleteModal.bind(this)}>حذف</Button>
                                : null}
                        </div>
                        <br />
                        <br />
                        {/* List Of Data */}
                        <ReactTable
                            getTrProps={this.editCategoryGallery}
                            data={this.props.listCategory}
                            columns={this.cells}
                        />
                    </div>
                </div>
                <Modal show={this.state.show} onHide={this.handleClose.bind(this)}>
                    <Modal.Header closeButton>
                        إضافة أو تعديل
                    </Modal.Header>
                    <Modal.Body className="modal-header">
                        <Formik validationSchema={schema} enableReinitialize={true}
                            onSubmit={(values) => {
                                this.addEditCategoryGallery(values)
                            }}
                            initialValues={{
                                Id: this.state.objCategory.Id,
                                typeOfCategory: this.state.objCategory.typeOfCategory,
                                categoryName: this.state.objCategory.categoryName,
                            }}>
                            {({ handleSubmit, handleChange, handleBlur, setFieldValue, setFieldTouched, values, touched, isValid, errors, }) => (
                                <Form noValidate onSubmit={handleSubmit} style={{ fontWeight: 'bold', fontSize: '25px', width: '100%' }}>
                                    <Form.Group controlId="typeOfCategory">
                                        <Form.Label>الأقسام الرئيسية</Form.Label>
                                        <Select
                                            name="typeOfCategory"
                                            id="typeOfCategory"
                                            value={values.typeOfCategory}
                                            onChange={(opt) => {
                                                setFieldValue("typeOfCategory", opt);
                                            }}
                                            options={this.props.ListParentProductCategoryForDrop}
                                            onBlur={handleBlur}
                                            error={errors.typeOfCategory}
                                            touched={touched.typeOfCategory}
                                        />
                                        <Form.Control.Feedback type="invalid" style={{ display: 'inline-block', color: "red" }}>
                                            {errors.typeOfCategory}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group controlId="categoryName">
                                        <Form.Label>الأقسام الفرعية</Form.Label>
                                        <Form.Control type="text"
                                            style={{ height: "50px" }}
                                            placeholder="الأقسام الفرعية"
                                            onChange={handleChange}
                                            aria-describedby="inputGroupPrepend"
                                            name="categoryName"
                                            autoComplete="off"
                                            value={values.categoryName}
                                            onBlur={handleBlur}
                                            isInvalid={!!errors.categoryName}
                                        />
                                        <Form.Control.Feedback type="invalid" style={{ color: "red" }}>
                                            {errors.categoryName}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <div style={{ direction: "ltr" }}>
                                        <Button size="lg" onClick={this.handleClose.bind(this)} style={{ marginRight: '10px' }}>
                                            غلق
                                                </Button>
                                        {this.state.isLoading ? <Button size="lg" disabled  >
                                            <Spinner
                                                as="span"
                                                animation="grow"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                                   تحميل
                                                </Button> :
                                            <Button size="lg" variant="success" type="submit">
                                                حفظ
                                                    </Button>}
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                </Modal>
                {this.state.showConfirme ? <Confirme text="هل تريد الحذف ?" show={this.state.showConfirme} handleClose={this.handleClose.bind(this)} handleDelete={this.handleConfirm} /> : null}
            </div>
        );
    }
}


const mapStateToProps = (state, ownProps) => ({
    ListParentProductCategoryForDrop: state.reduces.ListParentProductCategoryForDrop,
    listCategory: state.reduces.listCategory
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    actions: bindActionCreators(actions, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Category);