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


////////////// The Root Query /////////////:/
const RootQuery = new GraphQLObjectType({
    name : 'RootQueryType',
    fields: {
        TRUCKS_BY_ID: {
            type: TrucksType,
            args: {P_TRUCK_ID: {type: GraphQLInt}},    
            async resolve(parent,args){
                let sql= `select * from ait.ait_trucks where truck_id= :P_TRUCK_ID `;
                let binds = [args.P_TRUCK_ID];
                const result = await database.simpleExecute(sql,binds);
              //  console.log(result.metaData);
              return result.rows[0];
            }
        },        
        TRUCKS_ALL: {
            type: new GraphQLList(TrucksType),
            async resolve(){
                let sql= `select * from ait.ait_trucks order by truck_id desc`;
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
