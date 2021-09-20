const graphql = require('graphql');
const database = require('../database/oracle');

const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLFloat,
} = graphql;

const _ = require('lodash');
const OracleDB = require('oracledb');

//trucks
const TrucksType = new GraphQLObjectType({
    name : 'GET_TRUCKS',
    fields: () => ({
        TRUCK_ID:      { type: GraphQLInt },
        TRUCK_LICENSE: { type: GraphQLString },
        IS_ACTIVE:     { type: GraphQLInt },
        ORG_ID:        { type: GraphQLInt },
        IS_AUTONOMOUS: { type: GraphQLInt }
    })
});

const UserType = new GraphQLObjectType({
    name : 'GET_USER_TYPE',
    fields: () => ({        
        p_error_out: { type: GraphQLString }
    })
});

//trucks store procedure
const TrucksSPType = new GraphQLObjectType({
    name : 'GET_SP_TRUCKS',
    fields: () => ({
        TRUCK_ID:      { type: GraphQLInt/* , resolve: (info) => info.TRUCK_ID, */ },
        ORG_ID:        { type: GraphQLInt/* , resolve: (info) => info.ORG_ID, */ },
        TRUCK_LICENSE: { type: GraphQLString/* , resolve: (info) => info.TRUCK_LICENSE, */ },
        IS_ACTIVE:     { type: GraphQLInt/* , resolve: (info) => info.IS_ACTIVE, */ },
        IS_AUTONOMOUS: { type: GraphQLInt/* , resolve: (info) => info.IS_AUTONOMOUS, */ } 
      //  info:    { type: new GraphQLList (TrucksType) }
    })
});

const OwnersType = new GraphQLObjectType({
    name : 'GET_OWNERS',
    fields: () => ({
        info:    { type: GraphQLString } 
    })
});


////////////// The Root Query /////////////:/
const RootQuery = new GraphQLObjectType({
    name : 'RootQueryType',
    fields: {
        TRUCKS_BY_ID: {
            type: TrucksType,
            args: {P_TRUCK_ID: {type: GraphQLInt}},    
            async resolve(parent,args){
                let sql= `select * from ait_trucks where truck_id= :P_TRUCK_ID `;
                let binds = [args.P_TRUCK_ID];
                const result = await database.simpleExecute(sql,binds);
              //  console.log(result.metaData);
              return result.rows[0];
            }
        }, 
        //  TRUCKS_BY_ID_SP: {
        //      type: new GraphQLList(TrucksSPType),
        //      args: {p_truck_id: { type: GraphQLInt, dir: OracleDB.BIND_IN},
        //               p_org_id: { type: GraphQLInt, dir: OracleDB.BIND_IN},
        //                  info : { dir: OracleDB.BIND_INOUT, type: OracleDB.DB_TYPE_CURSOR} 
        //              },    
        //      async resolve(parent,args){
        //          let sql= `BEGIN AIT_OPERATION_PKG.select_truck_org (:p_truck_id, :p_org_id, :info); END;`;
        //        //  let binds=', {p_truck_id: 77, p_org_id: 1, info: { type: oracledb.CURSOR, dir: oracledb.BIND_OUT }}'
        //           let binds = [args.p_truck_id,args.p_org_id];
        //        //  let binds = [[1],[2]];
        //         // let options = { outFormat: OracleDB.CURSOR };
        //        /*   let options = { 
        //              bindDefs: [
        //                 { type: GraphQLString, dir: OracleDB.BIND_IN },
        //                 { type: GraphQLString, dir: OracleDB.BIND_IN },
        //                 { type: OracleDB.CURSOR, dir: OracleDB.BIND_OUT}
        //              ]
        //           }; */
        //          const result = await database.simpleExecute(sql,binds);
        //          console.log(result.outBinds.info.metaData);
        //        return result.rows;
        //      }
        //  },
        OWNERS: {
            type: new GraphQLList(OwnersType),
            args: {
                      //  info : { type: GraphQLList, dir: OracleDB.BIND_OUT} 
                    },    
            async resolve(parent,args){
                 let sql= `BEGIN AIT_OPERATION_PKG.select_owners( :info ); END;`;
                 //let binds = [args.info];
                 const result = await database.simpleExecute(sql);
                console.log(result.outBinds.info.metaData);
              return result.rows[0];
            }
        },
        UserTypeSP: {
            type: new GraphQLList (UserType),
            args: {     p_brand_code: { type: GraphQLString, dir: OracleDB.BIND_IN},
                        p_brand_desc: { type: GraphQLString, dir: OracleDB.BIND_IN},
                        p_creator_id: { type: GraphQLInt, dir: OracleDB.BIND_IN},  
                       p_error_out:   { type: GraphQLString, dir: OracleDB.BIND_OUT}
                    },    
            async resolve(parent,args){
                 let sql= `BEGIN AIT_OPERATION_PKG.add_brands( :p_brand_code, :p_brand_desc, :p_creator_id, :p_error_out ); END;`;
                 let binds = [args.p_brand_code,args.p_brand_desc,args.p_creator_id,args.p_error_out];
                 const result = await database.simpleExecute(sql,binds);
               // console.log(result.outBinds.);
             return result.rows;
            }
        },
        TRUCKS_ALL: {
            type: new GraphQLList(TrucksType),
            async resolve(){
                let sql= `select * from ait_trucks order by truck_id desc`;
                const result = await database.simpleExecute(sql);
                console.log(result.metaData);               
             return result.rows;
            }
        },
        
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery
})