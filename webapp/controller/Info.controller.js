sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/core/Fragment',
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"

], function (Controller, Fragment, MessageBox, JSONModel) {
    "use strict";

    return Controller.extend("authorMaster.library.controller.Info", {
        onInit: function () {
            this.MessageManager = sap.ui.getCore().getMessageManager();

            var oModel = this.MessageManager.getMessageModel();

            this.getView().setModel(oModel, "message");

            this.MessageManager.registerObject(this.getView(), true);
            this.Router = sap.ui.core.UIComponent.getRouterFor(this);
            this.Router.attachRouteMatched(this._onObjectMatched, this);
        },
        _onObjectMatched: function (oEvent) {
            sap.ui.getCore().getMessageManager().removeAllMessages();
            var sServiceUrl = this.getView().getModel().sServiceUrl;
            this.oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
            this.AuthorId = oEvent.getParameter("arguments").Author;
            this._onProcess();
        },
        _onProcess: function name(params) {

            this.sPath = "/AuthorSet('" + this.AuthorId + "')";
            var oView = this.getView();

            oView.bindElement(this.sPath);

            var oModel = oView.getModel();
            oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
            this.oSection = this.byId("iBooksList");
            var oContext = new sap.ui.model.Context(oModel, this.sPath);
            this.oSection.setBindingContext(oContext);

            var oVisibilityModel = new JSONModel({
                dobDisplay: true,
                dobEdit: false,
                save: false,
                edit: true,
                cancel: false,
                Delete: false,
                descDisplay: true,
                descEdit: false,
                ratings: false
            });

            this.getView().setModel(oVisibilityModel, "visibility")
        },

        onHandleEdit: function (oEvent) {
            debugger;
            var oModel = this.getView().getModel("visibility");
            var oTempModel = oModel.getData();
            oTempModel.dobDisplay = false,
                oTempModel.dobEdit = true,
                oTempModel.save = true,
                oTempModel.edit = false,
                oTempModel.cancel = true,
                oTempModel.Delete = true,
                oTempModel.descDisplay = false,
                oTempModel.descEdit = true,

                this.byId("iRating").setEditable(true);

            this.getView().getModel("visibility").setData(oTempModel);

            this.byId("sSimpleForm").setEditable(true);
        },

        onMessagePopoverPress: function (oEvent) {
            debugger;
            var oSourceControl = oEvent.getSource();
            this._getMessagePopover().then(function (oMessagePopover) {
                oMessagePopover.openBy(oSourceControl);
            });
        },
        _getMessagePopover: function () {

            var oView = this.getView();
            if (!this._pMessagePopover) {
                this._pMessagePopover = Fragment.load({
                    id: oView.getId(),
                    name: "authorMaster.library.fragments.MessagePopover"
                }).then(function (oMessagePopover) {
                    oView.addDependent(oMessagePopover);
                    return oMessagePopover;
                });
            }
            return this._pMessagePopover;
        },
        onHandleSave: function () {

            this.State = new sap.ui.model.json.JSONModel({
                AuthorName: "None",
                DateOfBirth: "None",
                Origin: "None",
                Description: "None"

            });

            this.getView().setModel(this.State, "State");

            this.oData = this.getView().getBindingContext().getObject();
            this.oData.DateOfBirth = this.byId("iDobE").getValue() + 'T00:00:00';
            this.oData.Ratings = this.byId("iRating").getValue()
            this.oData.Ratings = this.oData.Ratings.toString();
            this.oData.Description = this.byId("iDesE").getValue();

            var oError;
            var vAuthor = this.byId("iAuthor").getValue();
            if ((vAuthor === "") || (vAuthor === null)) {
                oError = this.byId("iAuthor");
                oError.setValueState(sap.ui.core.ValueState.Error);
                oError.setValueStateText("Please Enter the Author Name");
            }
            var vAuthorDob = this.byId("iDobE").getValue();
            if ((vAuthorDob === "") || (vAuthorDob === null)) {
                oError = this.byId("iDobE");
                oError.setValueState(sap.ui.core.ValueState.Error);
                oError.setValueStateText("Please choose a Date");
            }
            var vOrigin = this.byId("iOrigin").getValue();
            if ((vOrigin === "") || (vOrigin === null)) {
                oError = this.byId("iOrigin");
                oError.setValueState(sap.ui.core.ValueState.Error);
                oError.setValueStateText("Please Enter the Origin");
            }


            debugger;


            if (oError === undefined) {
                this.State.setData({
                    AuthorName: "None",
                    DateOfBirth: "None",
                    Origin: "None"

                });
                this.getView().setModel(this.State, "State");

                var that = this;
                debugger;
                sap.m.MessageBox.show("Are you sure to Change the data Permanently? ", {
                    title: "Warning",
                    actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                    emphasizedAction: sap.m.MessageBox.Action.OK,
                    onClose: function (oAction) {

                        if (oAction === "OK") {
                            that._Update();
                        }
                    }
                })
            }
        },
        _Update: function () {
            debugger;

            var oModel = this.getView().getModel();
            oModel.update(this.sPath, this.oData, {
                success: function (data, response) {
                    sap.ui.getCore().getMessageManager().removeAllMessages();
                    MessageBox.show("Updated Successfully",
                        {
                            title: "Success"
                        }
                    )
                },
                error: function (err) {
                    MessageBox.error("Error while Creating the Record.  Please check the Alert ");

                    $(err.response.body).find('message').first().text();
                }
            });
            oModel.refresh();
            this.onHandleCancel();
        },

        onHandleCancel: function () {
            var oModel = this.getView().getModel("visibility");
            var oTempModel = oModel.getData();

            oTempModel.dobDisplay = true,
                oTempModel.dobEdit = false,
                oTempModel.save = false,
                oTempModel.edit = true,
                oTempModel.cancel = false,
                oTempModel.Delete = false,
                oTempModel.descDisplay = true,
                oTempModel.descEdit = false;
            this.byId("iRating").setEditable(false);
            this.getView().getModel().refresh(true);
            this._onProcess();
            this.getView().getModel("visibility").setData(oTempModel);
            this.byId("sSimpleForm").setEditable(false);
        },
        onHandleDelete: function () {
            var that = this;
            MessageBox.show("Deleting the author, Which includes deleting all the author relted information in the library",
                {
                    title: "Warning",
                    actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                    emphasizedAction: MessageBox.Action.OK,


                    onClose: function (oAction) {

                        if (oAction === "OK") {
                            that.onDelete();
                        }
                    }
                })
        },
        onDelete: function () {
            var that = this;
            this.getView().getModel().
                remove(this.sPath, {
                    method: "DELETE",
                    success: function (data, response) {

                        sap.ui.getCore().getMessageManager().removeAllMessages();
                        MessageBox.show("Deleted Successfully",
                            {
                                title: "Success",
                                actions: [MessageBox.Action.OK],
                                emphasizedAction: MessageBox.Action.OK,
                                onClose: function (oAction) {
                                    that.Router.navTo("Master");
                                }
                            })
                    },
                    error: function (err) {
                        MessageBox.error("Error while Creating the Record.  Please check the Alert ");
                        $(err.response.body).find('message').first().text();
                    }
                });

            this.onHandleCancel();
        }
    });
});
