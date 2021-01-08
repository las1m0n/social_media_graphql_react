import React, {Component} from 'react';
import {withFormik, Form, Field} from 'formik';
import '../../../containers/Home/Home.css'

const form_id = 'form_id';

class MaintenanceForm extends Component {

    editOnClick = (event) => {
        event.preventDefault()
        const data = !(this?.props?.status?.edit)
        this.props.setStatus({
            edit: data,
        })
    }

    cancelOnClick = (event) => {
        event.preventDefault();
        this.props.resetForm();
        this.props.setStatus({
            edit: false,
        });
    }

    _renderAction() {
        return (
            <React.Fragment>
                <div className="form-statusbar">
                    {
                        this?.props?.status?.edit
                            ?
                            <React.Fragment>
                                <button className="btn btn-edit" type="submit" form={form_id}>Сохранить</button>
                                <button className="btn btn-edit" onClick={this.cancelOnClick}
                                        style={{marginLeft: "8px"}}>Отмена
                                </button>
                            </React.Fragment>
                            :
                            <button className="btn btn-edit" onClick={this.editOnClick}>Редактировать</button>
                    }
                </div>
            </React.Fragment>
        );
    }

    _renderFormView = () => {
        return (
            <React.Fragment>
                <div>
                    <label className="form-control" style={{width: "300px"}}>
                        {this?.props?.fields?.about}
                    </label>
                </div>
            </React.Fragment>
        );
    }

    _renderFormInput = () => {
        return (
            <React.Fragment>
                <div>
                    <Field type="text" name="about" className="form-control" style={{width: "300px"}}
                           placeholder="About"/>
                </div>
            </React.Fragment>
        );
    }

    render() {
        return (
            <React.Fragment>
                <div className="Timing">
                    <Form id={form_id}>
                        {
                            this?.props?.status?.edit
                                ?
                                this._renderFormInput()
                                :
                                this._renderFormView()
                        }
                    </Form>
                    {this._renderAction()}
                </div>
            </React.Fragment>
        );
    }
}

const FormikForm = withFormik({
    mapPropsToStatus: (props) => {
        return {
            edit: props?.edit || false,
        }
    },
    mapPropsToValues: (props) => {
        return {
            about: props.fields.about
        }
    },
    enableReinitialize: true,
    handleSubmit: (values, {props, ...actions}) => {
        props.updateFields(values);
        props.onChange({ variables: { status: values.about } })
        actions.setStatus({
            edit: false
        });
    }
})(MaintenanceForm);

export default FormikForm;