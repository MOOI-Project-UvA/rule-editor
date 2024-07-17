<script>
export default {
  name: "TreeviewBooleanConstruct",
  data: () => ({
    sampleStructure: [
      {
        "isNegated":false,
        "id": 1,
        "label": 1,
        "frame": {
          "id": 1,
          "label": 1
        },
        "children":[
            {
              "frame":{
          "id":"bfe04ded-0b3e-45e4-b81e-abc2c4075e80",
          "label":"Alleenstaande of een alleenstaande ouder zonder kostendelende medebewoners",
          "fact":"Alleenstaande of een alleenstaande ouder zonder kostendelende medebewoners",
          "typeId":"fact",
          "subTypeId":null,
          "comments":[

          ],
          "isComplex":true,
          "subdivision":{
            "isNegated":false,
            "children":[

            ],
            "operatorToJoinChildren":null
          },
          "annotations":[

          ]
        },
              "id": 2,
              "label": 2,
              "isNegated":false,
              "children":[],
              "operatorToJoinChildren":null
            },
            {
              "frame":{
                "id":"be3ecbde-9a67-4414-8e44-506d528c4955",
                "label":"Bijstandsnorm = € 1.283,83",
                "fact":"Bijstandsnorm = € 1.283,83",
                "typeId":"fact",
                "subTypeId":null,
                "comments":[

                ],
                "isComplex":true,
                "subdivision":{
                  "isNegated":false,
                  "children":[

                  ],
                  "operatorToJoinChildren":null
                },
                "annotations":[

                ]
              },
              "isNegated":false,
              "children":[
              ],
              "id": 3,
              "label": 3,
              "operatorToJoinChildren":null
            },
            {
              "isNegated":false,
              "children":[
                {
                  "isNegated":false,
                  "children":[],
                  "id": 5,
                  "label": 5,
                  "frame": {
                    "id":"a4fa22da-9157-4278-92b0-dd53c86f0c05",
                    "label":"Gehuwden waarvan beide echtgenoten jonger zijn dan de pensioengerechtigde leeftijd, zonder kostendelende medebewoners",
                    "fact":"Gehuwden waarvan beide echtgenoten jonger zijn dan de pensioengerechtigde leeftijd, zonder kostendelende medebewoners",
                    "typeId":"fact",
                    "subTypeId":null,
                    "annotations":[],
                    "comments":[],
                    "subdivision":{"frame":null,"isNegated":false,"children":[],"operatorToJoinChildren":null,"parent":null},
                    "_isComplex":true
                  },
                  "operatorToJoinChildren": null
                },
                {
                  "frame":{
                    "id":"f07d67e3-c469-4b8d-bfdd-36d9b68583fc",
                    "label":"Bijstandsnorm = € 1.834,04",
                    "fact":"Bijstandsnorm = € 1.834,04",
                    "typeId":"fact",
                    "subTypeId":null,
                    "annotations":[],
                    "comments":[],
                    "subdivision":{
                      "frame":null,
                      "isNegated":false,
                      "children":[],
                      "operatorToJoinChildren":null,
                      "parent":null
                    },
                    "isComplex":true
                  },
                  "isNegated":false,
                  "id": 6,
                  "label": 6,
                  "children":[],
                  "operatorToJoinChildren":null
                },
                {
                  "isNegated":false,
                  "id": 7,
                  "label": 7,
                  "frame": null,
                  "children":[
                    {
                      "isNegated":false,
                      "frame": null,
                      "children":[
                        {
                          "frame":{
                            "id":"de8a6d45-cf75-4a63-8675-64b178a2ebb6",
                            "label":"Belanghebbenden die de pensioengerechtigde leeftijd hebben bereikt",
                            "fact":"Belanghebbenden die de pensioengerechtigde leeftijd hebben bereikt",
                            "typeId":"fact",
                            "subTypeId":null,
                            "comments":[

                            ],
                            "isComplex":true,
                            "subdivision":{
                              "isNegated":false,
                              "children":[

                              ],
                              "operatorToJoinChildren":null
                            },
                            "annotations":[

                            ]
                          },
                          "isNegated":false,
                          "id": 9,
                          "label": 9,
                          "children":[],
                          "operatorToJoinChildren":"and"
                        },
                        {
                          "frame":{
                            "id":"03b1ad9e-e38d-4979-9587-793507c509d0",
                            "label":"Gehuwden waarvan een echtgenoot de pensioengerechtigde leeftijd heeft bereikt en de andere echtgenoot 21 jaar of ouder, doch de pensioengerechtigde leeftijd nog niet heeft bereikt, zonder kostendelende medebewoners",
                            "fact":"Gehuwden waarvan een echtgenoot de pensioengerechtigde leeftijd heeft bereikt en de andere echtgenoot 21 jaar of ouder, doch de pensioengerechtigde leeftijd nog niet heeft bereikt, zonder kostendelende medebewoners",
                            "typeId":"fact",
                            "subTypeId":null,
                            "comments":[

                            ],
                            "isComplex":true,
                            "subdivision":{
                              "isNegated":false,
                              "children":[

                              ],
                              "operatorToJoinChildren":null
                            },
                            "annotations":[

                            ]
                          },
                          "isNegated":false,
                          "children":[
                          ],
                          "operatorToJoinChildren":null,
                          "id": 10,
                          "label": 10,

                        }
                      ],
                      "operatorToJoinChildren":"and",
                      "id": 8,
                      "label": 8,

                    },
                    {
                      "frame":{
                        "id":"3ae8c1c0-9691-446c-882a-88f648ad0e0c",
                        "label":"Bijstandsnorm = € 1.933,98",
                        "fact":"Bijstandsnorm = € 1.933,98",
                        "typeId":"fact",
                        "subTypeId":null,
                        "comments":[

                        ],
                        "isComplex":true,
                        "subdivision":{
                          "isNegated":false,
                          "children":[

                          ],
                          "operatorToJoinChildren":null
                        },
                        "annotations":[

                        ]
                      },
                      "isNegated":false,
                      "children":[

                      ],
                      "operatorToJoinChildren":null,
                      "id": 11,
                      "label": 11,

                    },
                    {
                      "isNegated":false,
                      "children":[
                        {
                          "isNegated":false,
                          "children":[
                            {
                              "frame":{
                                "id":"056aae08-0e7f-46b1-be60-2e9237961083",
                                "label":"Belanghebbenden jonger dan 21 jaar zonder ten laste komende kinderen",
                                "fact":"Belanghebbenden jonger dan 21 jaar zonder ten laste komende kinderen",
                                "typeId":"fact",
                                "subTypeId":null,
                                "comments":[

                                ],
                                "isComplex":true,
                                "subdivision":{
                                  "isNegated":false,
                                  "children":[

                                  ],
                                  "operatorToJoinChildren":null
                                },
                                "annotations":[

                                ]
                              },
                              "isNegated":false,
                              "children":[

                              ],
                              "operatorToJoinChildren":null,
                              "id": 14,
                              "label": 14,
                            },
                            {
                              "frame":{
                                "id":"b6369548-dda0-4649-9631-77d56cd7db73",
                                "label":"Een alleenstaande van 18, 19 of 20 jaar",
                                "fact":"Een alleenstaande van 18, 19 of 20 jaar",
                                "typeId":"fact",
                                "subTypeId":null,
                                "comments":[

                                ],
                                "isComplex":true,
                                "subdivision":{
                                  "isNegated":false,
                                  "children":[

                                  ],
                                  "operatorToJoinChildren":null
                                },
                                "annotations":[

                                ]
                              },
                              "isNegated":false,
                              "children":[

                              ],
                              "operatorToJoinChildren":null,
                              "id": 15,
                              "label": 15,
                            }
                          ],
                          "operatorToJoinChildren":"and",
                          "frame": null,
                          "id": 13,
                          "label": 13,

                        },
                        {
                          "frame":{
                            "id":"e16340cb-7482-4e42-87a6-2e37b5892e8f",
                            "label":"Bijstandsnorm = € 316,94",
                            "fact":"Bijstandsnorm = € 316,94",
                            "typeId":"fact",
                            "subTypeId":null,
                            "comments":[

                            ],
                            "isComplex":true,
                            "subdivision":{
                              "isNegated":false,
                              "children":[

                              ],
                              "operatorToJoinChildren":null
                            },
                            "annotations":[

                            ]
                          },
                          "isNegated":false,
                          "children":[],
                          "operatorToJoinChildren":null,
                          "id": 16,
                          "label": 16,

                        },
                        {
                          "isNegated":false,
                          "children":[
                            {
                              "isNegated":false,
                              "children":[
                                {
                                  "frame":{
                                    "id":"056aae08-0e7f-46b1-be60-2e9237961083",
                                    "label":"Belanghebbenden jonger dan 21 jaar zonder ten laste komende kinderen",
                                    "fact":"Belanghebbenden jonger dan 21 jaar zonder ten laste komende kinderen",
                                    "typeId":"fact",
                                    "subTypeId":null,
                                    "comments":[

                                    ],
                                    "isComplex":true,
                                    "subdivision":{
                                      "isNegated":false,
                                      "children":[

                                      ],
                                      "operatorToJoinChildren":null
                                    },
                                    "annotations":[

                                    ]
                                  },
                                  "isNegated":false,
                                  "children":[

                                  ],
                                  "operatorToJoinChildren":null,
                                    "id": 19,
                  "label": 19,

                                },
                                {
                                  "frame":{
                                    "id":"2998f9e7-8390-4f63-af6c-5f970c03d501",
                                    "label":"Gehuwden waarvan beide echtgenoten 18, 19 of 20 jaar zijn",
                                    "fact":"Gehuwden waarvan beide echtgenoten 18, 19 of 20 jaar zijn",
                                    "typeId":"fact",
                                    "subTypeId":null,
                                    "comments":[

                                    ],
                                    "isComplex":true,
                                    "subdivision":{
                                      "isNegated":false,
                                      "children":[

                                      ],
                                      "operatorToJoinChildren":null
                                    },
                                    "annotations":[

                                    ]
                                  },
                                  "isNegated":false,
                                  "children":[

                                  ],
                                  "operatorToJoinChildren":null,
                                    "id": 20,
                  "label": 20,

                                }
                              ],
                              "operatorToJoinChildren":"and",
                              "frame": null,
                              "id": 18,
                              "label": 18,


                            },
                            {
                              "frame":{
                                "id":"aff16863-39c0-4d99-ab58-4cd0c230185e",
                                "label":"Bijstandsnorm(t) = € 633,88",
                                "fact":"Bijstandsnorm(t) = € 633,88",
                                "typeId":"fact",
                                "subTypeId":null,
                                "comments":[

                                ],
                                "isComplex":true,
                                "subdivision":{
                                  "isNegated":false,
                                  "children":[

                                  ],
                                  "operatorToJoinChildren":null
                                },
                                "annotations":[

                                ]
                              },
                              "isNegated":false,
                              "children":[

                              ],
                              "operatorToJoinChildren":null,
                              "id": 21,
                              "label": 21,

                            },
                            {
                              "isNegated":false,
                              "children":[
                                {
                                  "isNegated":false,
                                  "children":[
                                    {
                                      "frame":{
                                        "id":"056aae08-0e7f-46b1-be60-2e9237961083",
                                        "label":"Belanghebbenden jonger dan 21 jaar zonder ten laste komende kinderen",
                                        "fact":"Belanghebbenden jonger dan 21 jaar zonder ten laste komende kinderen",
                                        "typeId":"fact",
                                        "subTypeId":null,
                                        "comments":[

                                        ],
                                        "isComplex":true,
                                        "subdivision":{
                                          "isNegated":false,
                                          "children":[

                                          ],
                                          "operatorToJoinChildren":null
                                        },
                                        "annotations":[

                                        ]
                                      },
                                      "isNegated":false,
                                      "children":[

                                      ],
                                      "operatorToJoinChildren":null,
                                        "id": 24,
                  "label": 24,

                                    },
                                    {
                                      "frame":{
                                        "id":"ecf3cd04-e9ff-4202-ad30-ec143b3e6589",
                                        "label":"Gehuwden waarvan een echtgenoot 18, 19 of 20 jaar is en de andere echtgenoot 21 jaar of ouder, zonder kostendelende medebewoners",
                                        "fact":"Gehuwden waarvan een echtgenoot 18, 19 of 20 jaar is en de andere echtgenoot 21 jaar of ouder, zonder kostendelende medebewoners",
                                        "typeId":"fact",
                                        "subTypeId":null,
                                        "comments":[

                                        ],
                                        "isComplex":true,
                                        "subdivision":{
                                          "isNegated":false,
                                          "children":[

                                          ],
                                          "operatorToJoinChildren":null
                                        },
                                        "annotations":[

                                        ]
                                      },
                                      "isNegated":false,
                                      "children":[

                                      ],
                                      "operatorToJoinChildren":null,
                                        "id": 25,
                  "label": 25,

                                    }
                                  ],
                                  "operatorToJoinChildren":"and",
                                  "frame": null,
                                  "id": 23,
                                  "label": 23,
                                },
                                {
                                  "frame":{
                                    "id":"18f63a48-71b0-4f2a-8535-2af78aa0a0b7",
                                    "label":"Bijstandsnorm = € 1.233,96",
                                    "fact":"Bijstandsnorm = € 1.233,96",
                                    "typeId":"fact",
                                    "subTypeId":null,
                                    "comments":[

                                    ],
                                    "isComplex":true,
                                    "subdivision":{
                                      "isNegated":false,
                                      "children":[

                                      ],
                                      "operatorToJoinChildren":null
                                    },
                                    "annotations":[

                                    ]
                                  },
                                  "isNegated":false,
                                  "children":[

                                  ],
                                  "operatorToJoinChildren":null,
                                  "id": 30,
                  "label": 30,

                                },
                                {
                                  "isNegated":false,
                                  "children":[
                                    {
                                      "isNegated":false,
                                      "children":[
                                        {
                                          "frame":{
                                            "id":"863e9745-595d-495e-91ab-01a2bf440c3c",
                                            "label":"Belanghebbenden jonger dan 21 jaar met een of meer ten laste komende kinderen",
                                            "fact":"Belanghebbenden jonger dan 21 jaar met een of meer ten laste komende kinderen",
                                            "typeId":"fact",
                                            "subTypeId":null,
                                            "comments":[

                                            ],
                                            "isComplex":true,
                                            "subdivision":{
                                              "isNegated":false,
                                              "children":[

                                              ],
                                              "operatorToJoinChildren":null
                                            },
                                            "annotations":[

                                            ]
                                          },
                                          "isNegated":false,
                                          "children":[

                                          ],
                                          "operatorToJoinChildren":null
                                        },
                                        {
                                          "frame":{
                                            "id":"b6369548-dda0-4649-9631-77d56cd7db73",
                                            "label":"Een alleenstaande van 18, 19 of 20 jaar",
                                            "fact":"Een alleenstaande van 18, 19 of 20 jaar",
                                            "typeId":"fact",
                                            "subTypeId":null,
                                            "comments":[

                                            ],
                                            "isComplex":true,
                                            "subdivision":{
                                              "isNegated":false,
                                              "children":[

                                              ],
                                              "operatorToJoinChildren":null
                                            },
                                            "annotations":[

                                            ]
                                          },
                                          "isNegated":false,
                                          "children":[

                                          ],
                                          "operatorToJoinChildren":null
                                        }
                                      ],
                                      "operatorToJoinChildren":"and",
                                      "frame": null,
                                    },
                                    {
                                      "frame":{
                                        "id":"e16340cb-7482-4e42-87a6-2e37b5892e8f",
                                        "label":"Bijstandsnorm = € 316,94",
                                        "fact":"Bijstandsnorm = € 316,94",
                                        "typeId":"fact",
                                        "subTypeId":null,
                                        "comments":[

                                        ],
                                        "isComplex":true,
                                        "subdivision":{
                                          "isNegated":false,
                                          "children":[

                                          ],
                                          "operatorToJoinChildren":null
                                        },
                                        "annotations":[

                                        ]
                                      },
                                      "isNegated":false,
                                      "children":[

                                      ],
                                      "operatorToJoinChildren":null
                                    },
                                    {
                                      "isNegated":false,
                                      "children":[
                                        {
                                          "isNegated":false,
                                          "children":[
                                            {
                                              "frame":{
                                                "id":"863e9745-595d-495e-91ab-01a2bf440c3c",
                                                "label":"Belanghebbenden jonger dan 21 jaar met een of meer ten laste komende kinderen",
                                                "fact":"Belanghebbenden jonger dan 21 jaar met een of meer ten laste komende kinderen",
                                                "typeId":"fact",
                                                "subTypeId":null,
                                                "comments":[

                                                ],
                                                "isComplex":true,
                                                "subdivision":{
                                                  "isNegated":false,
                                                  "children":[

                                                  ],
                                                  "operatorToJoinChildren":null
                                                },
                                                "annotations":[

                                                ]
                                              },
                                              "isNegated":false,
                                              "children":[

                                              ],
                                              "operatorToJoinChildren":null
                                            },
                                            {
                                              "frame":{
                                                "id":"2998f9e7-8390-4f63-af6c-5f970c03d501",
                                                "label":"Gehuwden waarvan beide echtgenoten 18, 19 of 20 jaar zijn",
                                                "fact":"Gehuwden waarvan beide echtgenoten 18, 19 of 20 jaar zijn",
                                                "typeId":"fact",
                                                "subTypeId":null,
                                                "comments":[

                                                ],
                                                "isComplex":true,
                                                "subdivision":{
                                                  "isNegated":false,
                                                  "children":[

                                                  ],
                                                  "operatorToJoinChildren":null
                                                },
                                                "annotations":[

                                                ]
                                              },
                                              "isNegated":false,
                                              "children":[

                                              ],
                                              "operatorToJoinChildren":null
                                            }
                                          ],
                                          "operatorToJoinChildren":"and",
                                          "frame": null,
                                        },
                                        {
                                          "frame":{
                                            "id":"1b746eba-ac2b-46a2-9e16-bc8337b172b9",
                                            "label":"Bijstandsnorm = € 1.000,69",
                                            "fact":"Bijstandsnorm = € 1.000,69",
                                            "typeId":"fact",
                                            "subTypeId":null,
                                            "comments":[

                                            ],
                                            "isComplex":true,
                                            "subdivision":{
                                              "isNegated":false,
                                              "children":[

                                              ],
                                              "operatorToJoinChildren":null
                                            },
                                            "annotations":[

                                            ]
                                          },
                                          "isNegated":false,
                                          "children":[

                                          ],
                                          "operatorToJoinChildren":null
                                        },
                                        {
                                          "isNegated":false,
                                          "children":[
                                            {
                                              "isNegated":false,
                                              "children":[
                                                {
                                                  "frame":{
                                                    "id":"863e9745-595d-495e-91ab-01a2bf440c3c",
                                                    "label":"Belanghebbenden jonger dan 21 jaar met een of meer ten laste komende kinderen",
                                                    "fact":"Belanghebbenden jonger dan 21 jaar met een of meer ten laste komende kinderen",
                                                    "typeId":"fact",
                                                    "subTypeId":null,
                                                    "comments":[

                                                    ],
                                                    "isComplex":true,
                                                    "subdivision":{
                                                      "isNegated":false,
                                                      "children":[

                                                      ],
                                                      "operatorToJoinChildren":null
                                                    },
                                                    "annotations":[

                                                    ]
                                                  },
                                                  "isNegated":false,
                                                  "children":[

                                                  ],
                                                  "operatorToJoinChildren":null
                                                },
                                                {
                                                  "frame":{
                                                    "id":"ecf3cd04-e9ff-4202-ad30-ec143b3e6589",
                                                    "label":"Gehuwden waarvan een echtgenoot 18, 19 of 20 jaar is en de andere echtgenoot 21 jaar of ouder, zonder kostendelende medebewoners",
                                                    "fact":"Gehuwden waarvan een echtgenoot 18, 19 of 20 jaar is en de andere echtgenoot 21 jaar of ouder, zonder kostendelende medebewoners",
                                                    "typeId":"fact",
                                                    "subTypeId":null,
                                                    "comments":[

                                                    ],
                                                    "isComplex":true,
                                                    "subdivision":{
                                                      "isNegated":false,
                                                      "children":[

                                                      ],
                                                      "operatorToJoinChildren":null
                                                    },
                                                    "annotations":[

                                                    ]
                                                  },
                                                  "isNegated":false,
                                                  "children":[

                                                  ],
                                                  "operatorToJoinChildren":null
                                                }
                                              ],
                                              "operatorToJoinChildren":"and",
                                              "frame": null,
                                            },
                                            {
                                              "frame":{
                                                "id":"2d72f2a0-72b7-41b5-848c-7ddb8bfd50fb",
                                                "label":"Bijstandsnorm = € 1.600,77",
                                                "fact":"Bijstandsnorm = € 1.600,77",
                                                "typeId":"fact",
                                                "subTypeId":null,
                                                "comments":[

                                                ],
                                                "isComplex":true,
                                                "subdivision":{
                                                  "isNegated":false,
                                                  "children":[

                                                  ],
                                                  "operatorToJoinChildren":null
                                                },
                                                "annotations":[

                                                ]
                                              },
                                              "isNegated":false,
                                              "children":[

                                              ],
                                              "operatorToJoinChildren":null
                                            },
                                            {
                                              "isNegated":false,
                                              "children":[
                                                {
                                                  "frame":{
                                                    "id":"edc7e1a6-5c45-4ad0-81aa-d182eb5fcd09",
                                                    "label":"Belanghebbende van 21 jaar of ouder heeft een of meer kostendelende medebewoners",
                                                    "fact":"Belanghebbende van 21 jaar of ouder heeft een of meer kostendelende medebewoners",
                                                    "typeId":"fact",
                                                    "subTypeId":null,
                                                    "comments":[

                                                    ],
                                                    "isComplex":true,
                                                    "subdivision":{
                                                      "isNegated":false,
                                                      "children":[

                                                      ],
                                                      "operatorToJoinChildren":null
                                                    },
                                                    "annotations":[

                                                    ]
                                                  },
                                                  "isNegated":false,
                                                  "children":[

                                                  ],
                                                  "operatorToJoinChildren":null
                                                },
                                                {
                                                  "frame":{
                                                    "id":"858ac316-5e03-436a-833a-7897b1b1d8c9",
                                                    "label":"Bijstandsnorm = ((40% + A x 30%) / A) x B",
                                                    "fact":"Bijstandsnorm = ((40% + A x 30%) / A) x B",
                                                    "typeId":"fact",
                                                    "subTypeId":null,
                                                    "comments":[

                                                    ],
                                                    "isComplex":true,
                                                    "subdivision":{
                                                      "isNegated":false,
                                                      "children":[

                                                      ],
                                                      "operatorToJoinChildren":null
                                                    },
                                                    "annotations":[

                                                    ]
                                                  },
                                                  "isNegated":false,
                                                  "children":[

                                                  ],
                                                  "operatorToJoinChildren":null
                                                }
                                              ],
                                              "operatorToJoinChildren":"if",
                                              "frame": null,
                                            }
                                          ],
                                          "operatorToJoinChildren":"if",
                                          "frame": null,
                                        }
                                      ],
                                      "operatorToJoinChildren":"if",
                                      "frame": null,
                                    }
                                  ],
                                  "operatorToJoinChildren":"if",
                                  "frame": null,
                                }
                              ],
                              "operatorToJoinChildren":"if",
                              "frame": null,
                              "id": 26,
                              "label": 26,

                            }
                          ],
                          "operatorToJoinChildren":"if",
                          "frame": null,
                          "id": 17,
                          "label": 17

                        }
                      ],
                      "operatorToJoinChildren":"if",
                      "frame": null,
                      "id": 12,
                      "label": 12,
                    }
                  ],
                  "operatorToJoinChildren":"if"
                }
              ],
              "id": 4,
              "label": 4,
              "frame": null,
              "operatorToJoinChildren":"if"
            }
        ],
        "operatorToJoinChildren":"if",

    }
    ],
    booleanOptions: [
      { label: "AND", value: "and", description: "AND (boolean)" },
      { label: "OR", value: "or", description: "OR (boolean)" },
      { label: "PLUS", value: "plus", description: "Plus (arithmetic)" },
      { label: "MINUS", value: "minus", description: "Minus (arithmetic)" },
      {
        label: ">",
        value: "greaterThan",
        description: "Greater than (comparison)",
      },
      { label: "<", value: "lessThan", description: "Less than (comparison)" },
      {
        label: "≥",
        value: "greaterThanOrEqualTo",
        description: "Greater than or Equal to (comparison)",
      },
      {
        label: "≤",
        value: "lessThanOrEqualTo",
        description: "Less than or Equal to (comparison)",
      },
      { label: "=", value: "assign", description: "Assignment" },
      { label: "==", value: "equals", description: "Equals (comparison)" },
      { label: "IF", value: "if", description: "If function" },
    ],
    selectModel: [],
    options: null,
    selectedNode: null,
    maxNumber: 30

  }),
  mounted(){
    this.options = Array.from(this.booleanOptions)
  },
  methods:{
    getNodeByKey(key){
      console.log("returned node in the tree:", key)
      console.log(this.$refs["tree-structure"].getNodeByKey(key))
      return this.$refs["tree-structure"].getNodeByKey(key)
    },
    selectValue(val, id){
      console.log("using the q-select: value", val.value, id)
      console.log("this.value", this.sampleStructure[0])


    },
    passFunctionToLines(){
      //TODO: filter data structure, then pick its children and next to those children add the operator.
    },
    filterFn (val, update, abort) {
       update(()=> {
         const needle = val.toLowerCase()
         this.options = this.booleanOptions.filter(v=> v.value.toLowerCase().indexOf(needle) > -1)
       })
    },

    addChild(nodeId){
      this.maxNumber +=1

      console.log("addedChild to node:", nodeId)
      const selectedData = this.getNodeByKey(nodeId)
      console.log("selected", selectedData)
      selectedData.children.push({
        "frame": null, // if _frame has a value, this BC is 'atomic', it has no children. Its value is a frame.
        "isNegated": false,
        "children": [], // list of BooleanConstructs if _frame is null
        "operatorToJoinChildren": null, //"and" // or "or"
        "parent": null,
        "id": this.maxNumber,
        "label": this.maxNumber
      })

      //set focus to new child
      // this.$store.state.booleanConstructBeingEdited = newChild;
    }

  }
};
</script>

<template>
  <div id="treeview">
    Selected: {{selectedNode}} <br>
    q-select values : {{selectModel}}
    <q-btn @click="getNodeByKey(3)">Get node by id</q-btn>
    <q-tree ref="tree-structure" :nodes="sampleStructure" node-key="id" v-model:selected="selectedNode" selected-color="primary" dense default-expand-all>
      <template v-slot:default-header="prop">
        <div class="row items-center">
          <!--          <q-icon-->
          <!--            :name="prop.node.icon || 'share'"-->
          <!--            color="orange"-->
          <!--            size="28px"-->
          <!--            class="q-mr-sm"-->
          <!--          />-->
          <div>{{ prop.node.label }}</div>
          <div class="boolean-menu"  v-on:click.stop v-if="prop.node.children.length>0">
            <q-select
                dense
                filled
                use-input
                hide-selected
                fill-input
                input-debounce="0"
                label="Pick a function"
                :options="options"
                style="width: 150px; margin: 5px 10px;"
                v-model="prop.node.operatorToJoinChildren"
                @update:model-value="(value)=>{selectValue(value,prop.node.id)}"
                @filter="filterFn"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-italic text-grey">
                    No options slot
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
          <div v-else>
            <q-btn size="sm" dense outline class="q-ml-sm" @click="addChild(prop.node.id)">Add child</q-btn>
          </div>
        </div>
      </template>
      <template v-slot:default-body="prop">
          <div class="panel flex flex-row">
            <div class="col">

            </div>
            <div class="col-1 buttons-container">
               <div>
                 <q-btn size="sm" color="#d42d19" dense flat icon="mdi-minus-circle-outline" @click="toggleNegation" />
               </div>
               <div>
                 <q-btn size="sm" color="#007bc7" dense flat icon="mdi-format-list-bulleted-square" @click="subdivide" />
               </div>
               <div v-if="sampleStructure?.parent">
                 <q-btn size="sm" color="#007bc7" dense flat icon="mdi-close" @click="deleteBooleanConstruct" />
               </div>
            </div>
<!--              <div v-if="prop.node.label">-->
<!--                <span class="text-weight-bold">This node has a story</span>:-->
<!--                {{ prop.node.label }}-->
<!--              </div>-->
<!--              <span v-else class="text-weight-light text-black"-->
<!--                >This is some default content.</span>-->
          </div>
      </template>
    </q-tree>
  </div>
</template>

<style scoped lang="css">
.panel {
  margin-top: 8px;
  margin-bottom: 8px;
  padding: 10px 4px;
  border-radius: 5px;
  margin-left: 2px;
  box-shadow: 0px 0px 4px #aaaaaa;
  background-color: #ffffff;
  //border: solid 2px #ffffff;
}


.panel.active {
  border: solid 2px rgb(25, 118, 210);

}

.panel.negated {
  /* border: dotted 2px hsl(17, 79%, 46%); */
  background-color: rgb(255, 231, 222);
}

</style>
