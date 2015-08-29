/**
 * Copyright (c) 2015 OpenMediaVault Plugin Developers
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// require("js/omv/module/admin/service/docker/PortRow.js")
// require("js/omv/module/admin/service/docker/EnvVarRow.js")
// require("js/omv/module/admin/service/docker/BindMountRow.js")
// require("js/omv/module/admin/service/docker/RunContainer.js")
// require("js/omv/module/admin/service/docker/CreateContainer.js")
// require("js/omv/module/admin/service/docker/ExecuteCmd.js")
// require("js/omv/workspace/grid/Panel.js")
// require("js/omv/data/Store.js")
// require("js/omv/data/Model.js")
// require("js/omv/data/proxy/Rpc.js")

Ext.define("OMV.module.admin.service.docker.ContainerGrid", {
    extend: "OMV.workspace.grid.Panel",
    alias: "widget.dockerContainerGrid",

    id: "dockerContainerGrid",
    disableDeleteButton: true,
    deleteButtonText: _("Delete"),

    rpcService: "Docker",
    rpcGetMethod: "getContainers",
    requires: [
        "OMV.data.Store",
        "OMV.data.Model",
        "OMV.data.proxy.Rpc",
    ],

    stateful: true,
    stateId: "280eb3e7-c505-449c-9c84-1eb1b62b6b6a",

    defaults: {
        flex: 1
    },

    columns: [{
        text: _("CONTAINER ID"),
        dataIndex: 'id',
        sortable: true,
        stateId: 'id',
    },{
        text: _("IMAGE"),
        dataIndex: 'image',
        sortable: true,
        stateId: 'image',
    },{
        text: _("COMMAND"),
        dataIndex: 'command',
        sortable: true,
        stateId: 'command'
    },{
        text: _("CREATED"),
        dataIndex: 'created',
        sortable: true,
        stateId: 'created'
    },{
        text: _("STATUS"),
        dataIndex: 'status',
        sortable: true,
        stateId: 'status'
    },{
        text: _("PORTS"),
        dataIndex: 'ports',
        sortable: true,
        stateId: 'ports'
    },{
        text: _("NAMES"),
        dataIndex: 'name',
        sortable: true,
        stateId: 'name'
    }],

    initComponent: function() {
        var me = this;
        Ext.apply(me, {
            store: Ext.create("OMV.data.Store", {
                autoLoad: true,
                model: OMV.data.Model.createImplicit({
                    fields: [
                        { name: "id", type: "string" },
                        { name: "image", type: "string" },
                        { name: "command", type: "string" },
                        { name: "created", type: "string" },
                        { name: "status", type: "string" },
                        { name: "ports", type: "string" },
                        { name: "networkmode", type: "string" },
                        { name: "restartpolicy", type: "string" },
                        { name: "privileged", type: "boolean" },
                        { name: "exposedports", type: "array" },
                        { name: "envvars", type: "array" },
                        { name: "cenvvars", type: "array" },
                        { name: "portbindings", type: "array" },
                        { name: "name", type: "string" },
                        { name: "volumesfrom", type: "array" }
                    ]
                }),
                proxy: {
                    type: "rpc",
                    rpcData: {
                        service: "Docker",
                        method: "getContainers",
                    }
                }
            })
        });
        me.callParent(arguments);
    },

    getTopToolbarItems: function(c) {
        var me = this;
        return [{
            id: me.getId() + "-create",
            xtype: "button",
            text: _("Create"),
            icon: "images/add.png",
            iconCls: Ext.baseCSSPrefix + "btn-icon-16x16",
            disabled: true,
            handler: Ext.Function.bind(me.onCreateButton, me, [ me ]),
            scope: me
        },{
            id: me.getId() + "-start",
            xtype: "button",
            text: _("Start"),
            icon: "images/play.png",
            iconCls: Ext.baseCSSPrefix + "btn-icon-16x16",
            disabled: true,
            handler: Ext.Function.bind(me.onStartButton, me, [ me ]),
            scope: me
        },{
            id: me.getId() + "-stop",
            xtype: "button",
            text: _("Stop"),
            icon: "images/docker_stop.png",
            iconCls: Ext.baseCSSPrefix + "btn-icon-16x16",
            disabled: true,
            handler: Ext.Function.bind(me.onStopButton, me, [ me ]),
            scope: me
        },{
            id: me.getId() + "-restart",
            xtype: "button",
            text: _("Restart"),
            icon: "images/undo.png",
            iconCls: Ext.baseCSSPrefix + "btn-icon-16x16",
            disabled: true,
            handler: Ext.Function.bind(me.onRestartButton, me, [ me ]),
            scope: me
        },{
            id: me.getId() + "-copy",
            xtype: "button",
            text: _("Copy"),
            icon: "images/docker_copy.png",
            iconCls: Ext.baseCSSPrefix + "btn-icon-16x16",
            disabled: true,
            handler: Ext.Function.bind(me.onCopyButton, me, [ me ]),
            scope: me
        },{
            id: me.getId() + "-details",
            xtype: "button",
            text: _("Details"),
            icon: "images/search.png",
            iconCls: Ext.baseCSSPrefix + "btn-icon-16x16",
            disabled: true,
            handler: Ext.Function.bind(me.onDetailsButton, me, [ me ]),
            scope: me
        },{
            id: me.getId() + "-execute",
            xtype: "button",
            text: _("Run cmd"),
            icon: "images/docker_exec.png",
            iconCls: Ext.baseCSSPrefix + "btn-icon-16x16",
            disabled: true,
            handler: Ext.Function.bind(me.onExecuteButton, me, [ me ]),
            scope: me
        },{
            id: me.getId() + "-delete",
            xtype: "button",
            text: _("Delete"),
            icon: "images/delete.png",
            iconCls: Ext.baseCSSPrefix + "btn-icon-16x16",
            disabled: true,
            handler: Ext.Function.bind(me.onDeleteButton, me, [ me ]),
            scope: me
        },{
            id: me.getId() + "-refresh",
            xtype: "button",
            text: _("Refresh"),
            icon: "images/refresh.png",
            iconCls: Ext.baseCSSPrefix + "btn-icon-16x16",
            hidden: false,
            handler: Ext.Function.bind(me.onRefreshButton, me, [ me ]),
            scope: me
        }]
    },

    onSelectionChange: function(model, records) {
        var me = this;
        if(me.hideTopToolbar)
            return;
        var tbarBtnName = [ "create", "start", "stop", "restart", "copy", "details", "execute", "delete", "refresh" ];
        var tbarBtnDisabled = {
            "create": false,
            "start": false,
            "stop": false,
            "restart": false,
            "copy": false,
            "details": false,
            "execute": false,
            "delete": false,
            "refresh": false
        };
        // Enable/disable buttons depending on the number of selected rows.
        if(records.length <= 0) {
            tbarBtnDisabled["start"] = true;
            tbarBtnDisabled["stop"] = true;
            tbarBtnDisabled["restart"] = true;
            tbarBtnDisabled["copy"] = true;
            tbarBtnDisabled["details"] = true;
            tbarBtnDisabled["execute"] = true;
            tbarBtnDisabled["delete"] = true;
        } else if(records.length == 1) {
            // Disable 'Delete' button if selected node is not stopped
            Ext.Array.each(records, function(record) {
                if(!(record.get("state") === "dead" || record.get("state") === "stopped")) {
                    tbarBtnDisabled["delete"] = true;
                    return false;
                }
            });

            // Disable 'Execute' button if selected node is not running
            Ext.Array.each(records, function(record) {
                if(!(record.get("state") === "running")) {
                    tbarBtnDisabled["execute"] = true;
                    return false;
                }
            });
            
            // Disable buttons if selected node is a data container
            Ext.Array.each(records, function(record) {
                if(record.get("status") === "Created") {
                    tbarBtnDisabled["start"] = true;
                    tbarBtnDisabled["stop"] = true;
                    tbarBtnDisabled["restart"] = true;
                    tbarBtnDisabled["execute"] = true;
                    tbarBtnDisabled["copy"] = true;
                    return false;
                }
            });
        } else {
            tbarBtnDisabled["copy"] = true;
            tbarBtnDisabled["details"] = true;
            // Disable 'Delete' button if selected nodes are not stopped
            Ext.Array.each(records, function(record) {
                if(!(record.get("state") === "dead" || record.get("state") === "stopped")) {
                    tbarBtnDisabled["delete"] = true;
                    return false;
                }
            });
            
            // Disable buttons if selected node is a data container
            Ext.Array.each(records, function(record) {
                if(record.get("status") === "Created") {
                    tbarBtnDisabled["start"] = true;
                    tbarBtnDisabled["stop"] = true;
                    tbarBtnDisabled["restart"] = true;
                    tbarBtnDisabled["execute"] = true;
                    tbarBtnDisabled["copy"] = true;
                    return false;
                }
            });
        }

        // Update the button controls.
        Ext.Array.each(tbarBtnName, function(name) {
            var tbarBtnCtrl = me.queryById(me.getId() + "-" + name);
            if(!Ext.isEmpty(tbarBtnCtrl)) {
                if(true == tbarBtnDisabled[name]) {
                    tbarBtnCtrl.disable();
                } else {
                    tbarBtnCtrl.enable();
                }
            }
        });
    },

    onCreateButton: function() {
        var me = this;
        var imageStore = me.up('tabpanel').down('dockerImageGrid').getStore();
        Ext.create("OMV.module.admin.service.docker.CreateContainer", {
            title: _("Create data container"),
            imageStore: imageStore
        }).show();
    },

    onStartButton: function() {
        var me = this;
        var sm = me.getSelectionModel();
        var selRecords = sm.getSelection();
        var record = selRecords[0];
        var index;
        var idList = "";
        for(i = 0; i < selRecords.length; i++) {
            if(i === 0) {
                idList = selRecords[i].get("id");
            } else {
                idList = idList + " " + selRecords[i].get("id");
            }
        }
        OMV.Rpc.request({
            scope: me,
            callback: function(id, success, response) {
                sm.deselectAll();
                me.store.load({
                    scope: me,
                    callback: function(records, operation, success) {
                        for(i = 0; i < selRecords.length; i++) {
                            index = me.store.find('name', selRecords[i].get("name"));
                            sm.select(index, true);
                        }
                    }
                });
            },
            relayErrors: false,
            rpcData: {
                service: "Docker",
                method: "startContainer",
                params: {
                    id: idList
                }
            }
        });
    },

    onStopButton: function() {
        var me = this;
        var sm = me.getSelectionModel();
        var selRecords = sm.getSelection();
        var record = selRecords[0];
        var index;
        var idList = "";
        for(i = 0; i < selRecords.length; i++) {
            if(i === 0) {
                idList = selRecords[i].get("id");
            } else {
                idList = idList + " " + selRecords[i].get("id");
            }
        }
        OMV.Rpc.request({
            scope: me,
            callback: function(id, success, response) {
                sm.deselectAll();
                me.store.load({
                    scope: me,
                    callback: function(records, operation, success) {
                        for(i = 0; i < selRecords.length; i++) {
                            index = me.store.find('name', selRecords[i].get("name"));
                            sm.select(index, true);
                        }
                    }
                });
            },
            relayErrors: false,
            rpcData: {
                service: "Docker",
                method: "stopContainer",
                params: {
                    id: idList
                }
            }
        });
    },

    onRestartButton: function() {
        var me = this;
        var sm = me.getSelectionModel();
        var selRecords = sm.getSelection();
        var record = selRecords[0];
        var index;
        var idList = "";
        for(i = 0; i < selRecords.length; i++) {
            if(i === 0) {
                idList = selRecords[i].get("id");
            } else {
                idList = idList + " " + selRecords[i].get("id");
            }
        }
        OMV.Rpc.request({
            scope: me,
            callback: function(id, success, response) {
                sm.deselectAll();
                me.store.load({
                    scope: me,
                    callback: function(records, operation, success) {
                        for(i = 0; i < selRecords.length; i++) {
                            index = me.store.find('name', selRecords[i].get("name"));
                            sm.select(index, true);
                        }
                    }
                });
            },
            relayErrors: false,
            rpcData: {
                service: "Docker",
                method: "restartContainer",
                params: {
                    id: idList
                }
            }
        });
    },

    onDetailsButton: function() {
        var me = this;
        var sm = me.getSelectionModel();
        var records = sm.getSelection();
        var record = records[0];

        var detailsWindow = Ext.create("OMV.workspace.window.Form", {
            title: _("Container details"),
            rpcService: "Docker",
            rpcGetMethod: "getDetails",
            rpcGetParams: {
                id: record.get('id')
            },
            width: 800,
            height: 700,
            hideResetButton: true,
            hideCancelButton: true,
            okButtonText: _("Close"),
            scrollable: false,

            getFormItems: function() {
                var me = this;

                return [{
                    xtype: "textareafield",
                    name: "details",
                    grow: false,
                    height: 620,
                    readOnly: true,
                    fieldStyle: {
                        fontFamily: "courier",
                        fontSize: "12px"
                    }
                }];
            }
        }).show();
    },

    onExecuteButton : function() {
        var me = this;
        var sm = me.getSelectionModel();
        var records = sm.getSelection();
        var record = records[0];
        Ext.create("OMV.module.admin.service.docker.ExecuteCmd", {
            title: _("Execute command"),
            rpcService: "Docker",
            rpcMethod: "executeCommand",
            hideStopButton: true,
            containerId: record.get("id"),
            listeners: {
                scope: me,
                exception: function(wnd, error) {
                    OMV.MessageBox.error(null, error);
                }
            }
        }).show();
    },

    onCopyButton: function() {
        var me = this;
        var sm = me.getSelectionModel();
        var records = sm.getSelection();
        var record = records[0];
        Ext.create("OMV.module.admin.service.docker.RunContainer", {
            title: _("Copy container"),
            image: record.get("image"),
            ports: record.get("exposedports"),
            envvars: record.get("envvars"),
            restartpolicy: record.get("restartpolicy"),
            privileged: record.get("privileged"),
            networkmode: record.get("networkmode"),
            portbindings: record.get("portbindings"),
            bindmounts: record.get("bindmounts"),
            cenvvars: record.get("cenvvars"),
            copyVolumes: record.get("volumesfrom")
        }).show();
    },

    doDeletion: function(record) {
        var me = this;
        OMV.Rpc.request({
            scope: me,
            callback: me.onDeletion,
            rpcData: {
                service: "Docker",
                method: "deleteContainer",
                params: {
                    id: record.get('id')
                }
            }
        });
    }
});
