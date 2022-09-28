sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    'sap/ui/core/Fragment',
    "sap/ui/core/message/Message",
    "sap/ui/core/library",
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, JSONModel, Fragment, Message, library, MessageBox) {
        "use strict";
        var MessageType = library.MessageType;
        return Controller.extend("authorMaster.library.controller.Create", {
            onInit: function () {
                this.MessageManager = sap.ui.getCore().getMessageManager();

                var oModel = this.MessageManager.getMessageModel();

                this.getView().setModel(oModel, "message");

                this.MessageManager.registerObject(this.getView(), true);

                this._Router = sap.ui.core.UIComponent.getRouterFor(this);
                this._Router.getRoute("Create").attachMatched(this._onObjectMatched, this);

            },
            _onObjectMatched: function (oEvent) {



                sap.ui.getCore().getMessageManager().removeAllMessages();


                var that = this;

                 this.getView().getModel().refresh(true);

                var oModel = this.getView().getModel();
                oModel.setDefaultBindingMode(sap.ui.model.BindingMode.TwoWay);
                var oData = {};
                var oContext = oModel.createEntry("/AuthorSet");
                var sPath = oContext.getPath();
                that.getView().bindElement({
                    path: sPath
                });

            },
            onHandleCreate: function () {
                debugger;
                var oModel = this.getView().getModel();
                var oData = this.getView().getBindingContext().getObject();
                oData.AuthorId= "00000";
                oData.DateOfBirth = this.byId("iDob").getValue();
                oData.Ratings = this.byId("iRatings").getValue()
                oData.Ratings =  oData.Ratings.toString();
                oData.Description = this.byId("iDescription").getValue();
                this.State = new sap.ui.model.json.JSONModel({
                    AuthorName: "None",
                    DateOfBirth: "None",
                    Origin: "None",
                    Description: "None"
                });

                this.getView().setModel(this.State, "State");


                var oError;

                var vAuthor = this.byId("iAuthor").getValue();
                if ((vAuthor === "") || (vAuthor === null)) {
                    oError = this.byId("iAuthor");
                    oError.setValueState(sap.ui.core.ValueState.Error);
                    oError.setValueStateText("Please Enter the Author Name");
                }
                var vAuthorDob = this.byId("iDob").getValue();
                if ((vAuthorDob === "") || (vAuthorDob === null)) {
                    oError = this.byId("iDob");
                    oError.setValueState(sap.ui.core.ValueState.Error);
                    oError.setValueStateText("Please choose a Date");
                }
                var vOrigin = this.byId("iOrigin").getValue();
                if ((vOrigin === "") || (vOrigin === null)) {
                    oError = this.byId("iOrigin");
                    oError.setValueState(sap.ui.core.ValueState.Error);
                    oError.setValueStateText("Please Enter the Origin");
                }

                if ((oData.Description === "") || (oData.Description === null)) {
                    oError = this.byId("iDescription");
                    oError.setValueState(sap.ui.core.ValueState.Error);
                    oError.setValueStateText("Please provide Description");
                }


                if (oError === undefined) {
                    this.State.setData({
                        AuthorName: "None",
                        DateOfBirth: "None",
                        Origin: "None",
                        Description: "None"

                    });
                    this.getView().setModel(this.State, "State");

                    var that = this;
                    oModel.create("/AuthorSet", oData, {

                        success: function (data, response) {
                            sap.ui.getCore().getMessageManager().removeAllMessages();
                            MessageBox.show(" New Author " + data.AuthorName + " Created Successfully", {
                                title: "Success",
                                actions: [MessageBox.Action.OK],
                                emphasizedAction: MessageBox.Action.OK,


                                onClose: function (oAction) {


                                    that._Router.navTo("Master");

                                }
                            })
                        },

                        error: function (err) {
                            sap.ui.getCore().getMessageManager().removeAllMessages();
                         
                            MessageBox.error("Error while Creating the Record.  Please check the Alert ");
                        
                                $(err.response.body).find('message').first().text();
                        },

                        refreshAfterChange: true

                    });
                }

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

        })
    })


