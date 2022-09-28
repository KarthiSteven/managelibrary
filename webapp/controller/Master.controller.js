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
        return Controller.extend("authorMaster.library.controller.Master", {
            onInit: function () {
                this.MessageManager = sap.ui.getCore().getMessageManager();

                var oModel = this.MessageManager.getMessageModel();

                this.getView().setModel(oModel, "message");
                this.MessageManager.registerObject(this.getView(), true);
                
         
                
            
   
                var serviceModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZOD_MANAGE_LIBRARY_SRV/", true);
            

                var oTable = this.getView();

              //  oTable.setModel(serviceModel);
                
              //  oTable.rebindTable();

                this._oRouter = sap.ui.core.UIComponent.getRouterFor(this); 




            },
            onPress : function () {
                
            var oTable = this.getView().byId("iTable");
			var oContext = oTable.getSelectedItem().getBindingContext();
			var oObject = oContext.getObject(); 
            this._oRouter.navTo("Info", {Author : oObject.AuthorId});
            
        },
            onHandleAction: function (oEvent) {

debugger;
var oContext = oEvent.getSource().getBindingContext();
this.sPath = oContext.getPath();

var selectedRow = this.byId('iSmartTable').getModel().getProperty(this.sPath);
             
                var oModel = new JSONModel({
                    AuthorId: selectedRow.AuthorId,
                    AuthorName : selectedRow.AuthorName ,
                    DateOfBirth : selectedRow.DateOfBirth
                });
            
                this._oRouter.navTo("Update", {AuthorId : selectedRow.AuthorId});
                

/*
                if (!this.cDialog) {
                    Fragment.load({
                        name: "authorMaster.library.fragments.Update",
                        controller: this,
                    }).then(function (cDialog) {
                        this.cDialog = cDialog;
                       this.cDialog.setModel(oModel, "update")
                        this.cDialog.open();
                    }.bind(this));
                } else {
                    this.cDialog.open(this.sPath);
                }

                var oSrc = oEvent.getSource(),
				oView = this.getView();

			// create popover
            var oCtx = oEvent.getSource().getBindingContext(),
            oControl = oEvent.getSource(),
            oView = this.getView();

        // create popover
        debugger;
        if (!this._pPopover) {
            this._pPopover = Fragment.load({
                id: oView.getId(),
                name: "authorMaster.library.fragments.Action",
                controller: this
            }).then(function (oPopover) {
                oView.addDependent(oPopover);
                oPopover.bindElement(oCtx.getPath())
                return oPopover;
            }.bind(this));
        }
        this._pPopover.then(function(oPopover) {
           
        //    ;
            oPopover.openBy(oControl);
        });
*/
            },

            onHandleConform: function () {
                debugger;
                var updateData = {};
                updateData.AuthorName = sap.ui.core.Fragment.byId("iSimpleform", "iAuthor").getValue();
                var oModel = this.getView().getModel();

                oModel.update(this.sPath, updateData, {
                    success: function (data, response) {
                        var oMessage = new Message({
                            message: "Succesfully Updated the Author Name to " + updateData.AuthorName,
                            type: MessageType.Success
                        });
                        sap.ui.getCore().getMessageManager().removeAllMessages();
                        sap.ui.getCore().getMessageManager().addMessages(oMessage);

                    },
                    error: function (err) {
                        $(err.response.body).find('message').first().text();
                    }
                })

            },

            onHandleClose: function () {
                debugger;
                this.cDialog.close();
                this.cDialog.destroy();
            },


        onUpdate : function () {


            
        },

        onHandleCreate : function () {
            this._oRouter.navTo("Create");
        },

            onHanleCreate: function () {
                var oModel = new JSONModel({
                    AuthorName: ""
                });
                var oPage = this.byId("iPage")
                var oView = this.getView();
                /*
                    Fragment.load({
                       name: "authorMaster.library.fragments.Create",
                       controller: this,
                   }).then(function(oFragment){
                      oView.addDependent(oFragment);
                       // put the Fragment content into the document
                       //oFragment.placeAt('iDynamicPageHeader1');
                      //oFragment.open();
                      oPage.addContent(oFragment);
                   })
       */
                this.oFragment = sap.ui.xmlfragment("authorMaster.library.fragments.Create", this);
                oView.addDependent(this.oFragment);
                this.byId("iDynamicPageHeader1").addContent(this.oFragment);
            },


            onHandleSave: function () {
                debugger;
                var postData = {};
                postData.AuthorName = sap.ui.getCore().byId("iAuthorNew").getValue();
                this.getView().getModel().create("/AuthorSet", postData, {
                    success: function (data, response) {

                        var oMessage = new Message({
                            message: "Created Successfully",
                            type: MessageType.Success
                        });
                        sap.ui.getCore().getMessageManager().removeAllMessages(); //Remove All the messages for Created related Messages.
                        sap.ui.getCore().getMessageManager().addMessages(oMessage);

                    },
                    error: function (err) {
                        $(err.response.body).find('message').first().text();
                    },

                    refreshAfterChange: true

                });
                //this.getView().getModel().refresh();

                this.oFragment.destroy();
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
            }
        });

    });

