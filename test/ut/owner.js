
var RepoClient = require("../../fis-repo-client.js"),
    domain = "localhost",
    port = "3459",
    repos = domain + ":" + port,
    client = new RepoClient(repos);
var expect = require('chai').expect;
var fis =  require('fis-cloud-kernel');

//entaining with ensurance that there is no users or pkgs
var pkg1 = {
    name : "smart-cov",
    version : "0.0.1"
};
var pkg2 = {
    name : "smart-cov",
    version : "0.0.2"
};

describe('add--', function(){

    // it('no adder',function(done){
    //     var options = {
    //         username : "tian"
    //     };

    //     client.owner('add', pkg1, options, function(error){
    //         expect(error).to.be.equal("User [tian] not exist, register first!");
    //         done();
    //     });

    // });
    

    it('add owner to pkg not exist + ls non-exist pkg', function(done){
        var options = {
            username : "tian"
        };
        
            client.adduser('tian','tian','tian@baidu.com',function(){
                client.owner('add',pkg1,options, function(err,m){
                    expect(err).to.be.equal("Component [smart-cov@0.0.1] not found!");

                    client.owner('ls', pkg1, options, function(err,m){
                        expect(err).to.be.equal("Component [smart-cov]@0.0.1 not found!");
                        done();
                    });

                });
            });
        
    });

    it('no added', function(done){
        var dir1 = "./test/ut/publish/4";
        var options = {
            username : "lily"
        };

        client.adduser('tian','tian','tian@baidu.com',function(e,m){
            client.publish(dir1, {}, function(e,m){
                client.owner('add',pkg1, options,function(error,m){
                    expect(error).to.be.equal("User [lily] not exist, register first!");
                    
                    // client.owner('ls',pkg1,{}, function(err, msg){
                    //     expect(msg).to.be.equal("\nusername : tian email : tian@baidu.com\n");

                        done();
                    // });

                });
            });
        });

    });

    it('owner twice', function(done){
        var options = {
            username : "tian"
        };

            client.owner('add',pkg1, options,function(err,msg){
                expect(msg).to.be.equal("Add user [tian] success!");
                done();
            });


    });

//    it('one owner all owner', function(done){
//        var dir2 = __dirname+'/publish/6';
//        setTimeout(
//            client.publish(dir2, {force:true}, function(){
//
//                client.owner('ls',pkg1,{username:"tian"}, function(err, msg){
//                    expect(msg).to.be.equal("\nusername : tian email : tian@baidu.com\n");
//
//                    client.owner('ls',pkg2,{username:"tian"}, function(err, msg){
//                        expect(msg).to.be.equal("\nusername : tian email : tian@baidu.com\n");
//                        done();
//                    });
//                });
//            })
//            , 10000);
//
//    });

    it('add owner + one owner all owner', function(done){
        var options = {
            username : "lily"
        };

        client.adduser('lily','lily','lily@baidu.com',function(){
            //更换权限用户
            client.adduser('tian','tian','tian@baidu.com',function(){
                client.owner('add',pkg1, options,function(error,msg){
                    expect(msg).to.be.equal("Add user [lily] success!");

                    client.owner('ls',pkg1,{}, function(err, msg){
                        expect(msg).to.be.equal("\nusername : tian email : tian@baidu.com\nusername : lily email : lily@baidu.com\n");

//                        client.owner('ls',pkg2,{username:"lily"}, function(err, msg){
//                            expect(msg).to.be.equal("\nusername : tian email : tian@baidu.com\nusername : lily email : lily@baidu.com\n");
                            done();
//                        });
                    });
                });
            });

        });

    });

});

describe('delete--', function(){
    var pkg1 = {
        name : "smart-cov",
        version : "0.0.1"
    };
    var pkg2 = {
        name : "smart-cov",
        version : "0.0.2"
    };
//    before(function(){
//        client.adduser('tian','tian','tian@baidu.com');
//    });
    after(function(done){
        client.unpublish({name:"smart-cov",version:"all"}, {}, function(){
            // fis.db.remove("user", "tian", {name : "tian"}, {}, function(){
            //     fis.db.remove("user", "tmp", {name : "tian"}, {}, function(){
                    done();
            //     });
            // });
        });
    });

    it('general + ls change + one del all del',function(done){
        var options = {
            username : "lily"
        };

        client.owner('rm',pkg1,options, function(err, msg){
            expect(msg).to.be.equal("Remove user [lily] success!");

            client.owner('ls',pkg1,{}, function(err, msg){
                expect(msg).to.be.equal("\nusername : tian email : tian@baidu.com\n");

//                client.owner('ls',pkg2,{username:"lily"}, function(err, msg){
//                    expect(msg).to.be.equal("\nusername : tian email : tian@baidu.com\n");
                    done();
//                });
            });
        });
    });

    it('del twice',function(done){
        var options = {
            username : "lily"
        };

        client.owner('rm',pkg1,options, function(err){
            expect(err).to.be.equal("Owner rm error User [lily] is not maintainer");

            done();
        });
    });

    it('no deleted',function(done){
        var options = {
            username : "lily"
        };

        fis.db.remove("user", "lily", {name : "lily"}, {}, function(){
            client.owner('rm',pkg1,options, function(err){
                expect(err).to.be.equal("User [lily] not exist, register first!");

                done();
            });
        });
    });

    it('deleter is not owner + lser is not owner',function(done){
        var options = {
            username : "tian"
        };

        client.adduser('tmp','tmp','tmp@baidu.com',function(){
            client.owner('rm',pkg1,options, function(err){
                expect(err).to.be.equal("No permission rm owner for component [smart-cov@0.0.1]");

                client.owner('ls',pkg1, options, function(err,msg){
                    expect(msg).to.be.equal("\nusername : tian email : tian@baidu.com\n");

                    done();
                });

            });

        });

    });

//    //BUG--add after bug fixed, otherwise will produce non-maintainer pkg
//    it('self del',function(done){
//        var options = {
//            username : "tian"
//        };
//
//        fis.db.remove("user", "tmp", {name : "tmp"}, {}, function(){
//            client.adduser('tian','tian','tian@baidu.com',function(){
//                client.owner('rm',pkg1,options, function(err){
//                    expect(err).to.be.equal("No permission rm owner for component [smart-cov@0.0.1]");
//
//                    done();
//                });
//            });
//        });
//    });

    it('del for pkg not exist + ls for nonexist version',function(done){
        var options = {
            username : "tian"
        };

        client.adduser('tian','tian','tian@baidu.com',function(){
            client.unpublish(pkg1, {}, function(e,m){
                client.owner('rm',pkg1,options, function(err){
                    expect(err).to.be.equal("Component [smart-cov@0.0.1] not found!");

    //                client.unpublish(pkg2, {}, function(){

    //                    client.owner('ls',pkg2,{}, function(err){
    //                        expect(err).to.be.equal("error");

                            done();
    //                    });
    //                });
                });

            });
        });
        

    });
});