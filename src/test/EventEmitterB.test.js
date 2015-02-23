var proto = require("proto");
var testUtils = require('testUtils')
var EventEmitterB = require("EventEmitterB");

module.exports = function(t) {



    //*
    this.test("ifon, ifoff", function() {

        this.test("normal usage", function(t) {
            this.count(56)

            var e = EventEmitterB()

            var event = testUtils.seq(
            // e.on('a', cb1)
              function(eventName, type) {
                t.eq(eventName, 'a')
                t.eq(type, 'on')
            },function(eventName, type, all) {
                t.eq(eventName, 'a')
                t.eq(type, 'on')
                t.eq(all, true)

            // e.on('b', cb2)
            },function(eventName, type) {
                t.eq(eventName, 'b')
                t.eq(type, 'on')
            },function(eventName, type, all) {
                t.eq(eventName, 'b')
                t.eq(type, 'on')
                t.eq(all, true)

            // e.removeListener('b', cb2)
            },function(eventName, type) {
                t.eq(eventName, 'b')
                t.eq(type, 'off')
            },function(eventName, type, all) {
                t.eq(eventName, 'b')
                t.eq(type, 'off')
                t.eq(all, true)

            // e.removeListener('a', cb2)
            },function(eventName, type) {
                t.eq(eventName, 'a')
                t.eq(type, 'off')
            },function(eventName, type, all) {
                t.eq(eventName, 'a')
                t.eq(type, 'off')
                t.eq(all, true)

            // e.once('a', cb3)
            },function(eventName, type) {
                t.eq(eventName, 'a')
                t.eq(type, 'on')
            },function(eventName, type, all) {
                t.eq(eventName, 'a')
                t.eq(type, 'on')
                t.eq(all, true)

            // e.emit('a')
            },function(eventName, type) {
                t.eq(eventName, 'a')
                t.eq(type, 'off')
            },function(eventName, type, all) {
                t.eq(eventName, 'a')
                t.eq(type, 'off')
                t.eq(all, true)

            // e.on('a', cb1)
            // e.on('b', cb1)
            // e.on('a', cb2)
            // e.on('b', cb2)
            // e.on('c', cb1)
            },function(eventName, type) {
                t.eq(eventName, 'a')
                t.eq(type, 'on')
            },function(eventName, type, all) {
                t.eq(eventName, 'a')
                t.eq(type, 'on')
                t.eq(all, true)
            },function(eventName, type) {
                t.eq(eventName, 'b')
                t.eq(type, 'on')
            },function(eventName, type, all) {
                t.eq(eventName, 'b')
                t.eq(type, 'on')
                t.eq(all, true)
            },function(eventName, type, all) {
                t.eq(eventName, 'c')
                t.eq(type, 'on')
                t.eq(all, true)

            // e.removeAllListeners('a')
            },function(eventName, type) {
                t.eq(eventName, 'a')
                t.eq(type, 'off')
            },function(eventName, type, all) {
                t.eq(eventName, 'a')
                t.eq(type, 'off')
                t.eq(all, true)

            // e.removeAllListeners()
            },function(eventName, type) {
                t.eq(eventName, 'b')
                t.eq(type, 'off')
            },function(eventName, type, all) {
                t.eq(eventName, 'b')
                t.eq(type, 'off')
                t.eq(all, true)
            },function(eventName, type, all) {
                t.eq(eventName, 'c')
                t.eq(type, 'off')
                t.eq(all, true)
            })

            e.ifon('a', function() {
                event('a', 'on')
            })
            e.ifoff('a', function() {
                event('a', 'off')
            })
            e.ifon('b', function() {
                event('b', 'on')
            })
            e.ifoff('b', function() {
                event('b', 'off')
            })

            e.ifon(function(eventName) {
                event(eventName, 'on', true)
            })
            e.ifoff(function(eventName) {
                event(eventName, 'off', true)
            })

            var cb1 = function(){}
            var cb2 = function(){}
            var cb3 = function(){}

            e.on('a', cb1)
            e.on('b', cb2)
            e.on('a', cb2)
            e.removeListener('a', cb1)
            e.removeListener('b', cb2)
            e.removeListener('a', cb2)

            e.once('a', cb3)
            e.emit('a')

            e.on('a', cb1)
            e.on('b', cb1)
            e.on('a', cb2)
            e.on('b', cb2)
            e.on('c', cb1)
            e.removeAllListeners('a')
            e.removeAllListeners()
        })

        this.test("ifon after events have been attachd", function(t) {
            this.count(4)

            var e = EventEmitterB()

            var sequenceEvent = testUtils.seq(
            // e.on('a', cb1)
              function(eventName) {
                t.eq(eventName, 'shmaotown')
            },function(eventName) {
                t.eq(eventName, 'you lazy plughole')
            },function(eventName) {
                t.eq(eventName, 'all shmaotown')
            },function(eventName) {
                t.eq(eventName, 'all you lazy plughole')
            })

            e.on('shmaotown', function() {})
            e.on('you lazy plughole', function() {})


            e.ifon('shmaotown', function() {
                sequenceEvent('shmaotown')
            })
            e.ifon('you lazy plughole', function() {
                sequenceEvent('you lazy plughole')
            })
            e.ifon(function(eventName) {
                sequenceEvent('all '+eventName)
            })
        })

        this.test("remove ifon", function(t) {
            this.count(26)

            var e = EventEmitterB()

            var event = testUtils.seq(
            // remove a
              function(eventName) {
                t.eq(eventName, 'a2')
            },function(eventName) {
                t.eq(eventName, 'all1')
            },function(eventName) {
                t.eq(eventName, 'all2')
            },function(eventName) {
                t.eq(eventName, 'b')
            },function(eventName) {
                t.eq(eventName, 'b2')
            },function(eventName) {
                t.eq(eventName, 'all1')
            },function(eventName) {
                t.eq(eventName, 'all2')
            },function(eventName) {
                t.eq(eventName, 'c')
            },function(eventName) {
                t.eq(eventName, 'c2')
            },function(eventName) {
                t.eq(eventName, 'all1')
            },function(eventName) {
                t.eq(eventName, 'all2')

            // remove bs
            },function(eventName) {
                t.eq(eventName, 'a2')
            },function(eventName) {
                t.eq(eventName, 'all1')
            },function(eventName) {
                t.eq(eventName, 'all2')
            },function(eventName) {
                t.eq(eventName, 'all1')
            },function(eventName) {
                t.eq(eventName, 'all2')
            },function(eventName) {
                t.eq(eventName, 'c')
            },function(eventName) {
                t.eq(eventName, 'c2')
            },function(eventName) {
                t.eq(eventName, 'all1')
            },function(eventName) {
                t.eq(eventName, 'all2')

            // remove ifon-all callback
            },function(eventName) {
                t.eq(eventName, 'a2')
            },function(eventName) {
                t.eq(eventName, 'all2')
            },function(eventName) {
                t.eq(eventName, 'all2')
            },function(eventName) {
                t.eq(eventName, 'c')
            },function(eventName) {
                t.eq(eventName, 'c2')
            },function(eventName) {
                t.eq(eventName, 'all2')
            })

            var a,a2, b,b2, c,c2, all1,all2
            e.ifon('a', a = function() {
                event('a')
            })
            e.ifon('a', a2=function() {
                event('a2')
            })
            e.ifon('b', b=function() {
                event('b')
            })
            e.ifon('b', b2=function() {
                event('b2')
            })
            e.ifon('c', c=function() {
                event('c')
            })
            e.ifon('c', c2=function() {
                event('c2')
            })

            e.ifon(all1=function() {
                event('all1')
            })
            e.ifon(all2=function() {
                event('all2')
            })

            t.log('remove a')
            e.removeIfon('a', a)
            e.on('a',function(){})
            e.on('b',function(){})
            e.on('c',function(){})

            e.removeAllListeners()

            t.log('remove bs')
            e.removeIfon('b')
            e.on('a',function(){})
            e.on('b',function(){})
            e.on('c',function(){})

            e.removeAllListeners()

            t.log('remove ifon-all callback')
            e.removeIfon(all1)
            e.on('a',function(){})
            e.on('b',function(){})
            e.on('c',function(){})

            e.removeAllListeners()

            t.log('remove all')
            e.removeIfon()
            e.on('a',function(){})
            e.on('b',function(){})
            e.on('c',function(){})
        })

        this.test("remove ifoff", function(t) {
            this.count(26)

            var e = EventEmitterB()

            var event = testUtils.seq(
            // remove a
              function(eventName) {
                t.eq(eventName, 'a2')
            },function(eventName) {
                t.eq(eventName, 'all1')
            },function(eventName) {
                t.eq(eventName, 'all2')
            },function(eventName) {
                t.eq(eventName, 'b')
            },function(eventName) {
                t.eq(eventName, 'b2')
            },function(eventName) {
                t.eq(eventName, 'all1')
            },function(eventName) {
                t.eq(eventName, 'all2')
            },function(eventName) {
                t.eq(eventName, 'c')
            },function(eventName) {
                t.eq(eventName, 'c2')
            },function(eventName) {
                t.eq(eventName, 'all1')
            },function(eventName) {
                t.eq(eventName, 'all2')

            // remove bs
            },function(eventName) {
                t.eq(eventName, 'a2')
            },function(eventName) {
                t.eq(eventName, 'all1')
            },function(eventName) {
                t.eq(eventName, 'all2')
            },function(eventName) {
                t.eq(eventName, 'all1')
            },function(eventName) {
                t.eq(eventName, 'all2')
            },function(eventName) {
                t.eq(eventName, 'c')
            },function(eventName) {
                t.eq(eventName, 'c2')
            },function(eventName) {
                t.eq(eventName, 'all1')
            },function(eventName) {
                t.eq(eventName, 'all2')

            // remove ifoff-all callback
            },function(eventName) {
                t.eq(eventName, 'a2')
            },function(eventName) {
                t.eq(eventName, 'all2')
            },function(eventName) {
                t.eq(eventName, 'all2')
            },function(eventName) {
                t.eq(eventName, 'c')
            },function(eventName) {
                t.eq(eventName, 'c2')
            },function(eventName) {
                t.eq(eventName, 'all2')
            })

            var a,a2, b,b2, c,c2, all1, all2
            e.ifoff('a', a = function() {
                event('a')
            })
            e.ifoff('a', a2=function() {
                event('a2')
            })
            e.ifoff('b', b=function() {
                event('b')
            })
            e.ifoff('b', b2=function() {
                event('b2')
            })
            e.ifoff('c', c=function() {
                event('c')
            })
            e.ifoff('c', c2=function() {
                event('c2')
            })

            e.ifoff(all1=function() {
                event('all1')
            })
            e.ifoff(all2=function() {
                event('all2')
            })

            var a,b,c

            t.log('remove a')
            e.removeIfoff('a', a)
            e.on('a',a=function(){})
            e.on('b',b=function(){})
            e.on('c',c=function(){})
            e.removeListener('a',a)
            e.removeListener('b',b)
            e.removeListener('c',c)

            e.on('a',a)
            e.on('b',b)
            e.on('c',c)

            t.log('remove bs')
            e.removeIfoff('b')
            e.removeListener('a',a)
            e.removeListener('b',b)
            e.removeListener('c',c)

            e.on('a',a)
            e.on('b',b)
            e.on('c',c)

            t.log('remove ifoff-all callback')
            e.removeIfoff(all1)
            e.removeListener('a',a)
            e.removeListener('b',b)
            e.removeListener('c',c)

            e.on('a',a)
            e.on('b',b)
            e.on('c',c)

            t.log('remove all')
            e.removeIfoff()
            e.removeListener('a',a)
            e.removeListener('b',b)
            e.removeListener('c',c)
        })
    })

    this.test("proxy events", function() {
        this.test("proxy all", function(t){
            this.count(2)

            var A = EventEmitterB()
            var B = EventEmitterB()

            var testEvent = testUtils.seq(
              function(eventName) {
                t.eq(eventName, 'moose')
            },function(eventName) {
                t.eq(eventName, 'bark')
            })


            A.proxy(B)   // proxy all events

            A.on('moose', function() {
                testEvent('moose')
            })
            A.on('bark', function() {
                testEvent('bark')
            })

            B.emit('moose')
            B.emit('bark')
        })

        this.test("proxy only", function(t){
            this.count(1)

            var A = EventEmitterB()
            var B = EventEmitterB()

            var testEvent = testUtils.seq(
              function(eventName) {
                t.eq(eventName, 'moose')
            })


            A.proxy(B, {only: ['moose']})   // proxy only the 'moose' event

            A.on('moose', function() {
                testEvent('moose')
            })
            A.on('bark', function() {
                testEvent('bark')
            })

            B.emit('moose')
            B.emit('bark')
        })

        this.test("proxy except", function(t){
            this.count(1)

            var A = EventEmitterB()
            var B = EventEmitterB()

            var testEvent = testUtils.seq(
              function(eventName) {
                t.eq(eventName, 'bark')
            })


            A.proxy(B, {except: ['moose']})   // proxy only the 'moose' event

            A.on('moose', function() {
                testEvent('moose')
            })
            A.on('bark', function() {
                testEvent('bark')
            })

            B.emit('moose')
            B.emit('bark')
        })

        this.test("proxy removeListener and removeAllListeners", function() {
            var A = EventEmitterB()
            var B = EventEmitterB()

            this.eq(B.listeners('moose').length, 0)

            A.proxy(B)

            var handler;
            A.on('moose', handler=function() {
                testEvent('moose')
            })

            this.eq(B.listeners('moose').length, 1)

            A.removeListener('moose',handler)
            this.eq(B.listeners('moose').length, 0)

            A.on('moose', handler)
            A.removeAllListeners('moose')
            this.eq(B.listeners('moose').length, 0)

            A.on('moose', handler)
            A.removeAllListeners()
            this.eq(B.listeners('moose').length, 0)
        })
    })
    //*/
};