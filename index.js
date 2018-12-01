/**
 * @file   mofron-comp-sptree/index.js
 * @brief  single page tree component
 * @author simpart
 */
const mf = require('mofron');
const Text = require('mofron-comp-text');
const TreeIF = require('mofron-comp-treeif');
const Click = require('mofron-event-click');
const OrdView = require('mofron-effect-orderview');
const VisiClk = require('mofron-event-visiclick');

mf.comp.SpTree = class extends TreeIF {
    
    /**
     * initialize component
     * 
     * @param po paramter or option
     */
    constructor (po) {
        try {
            super();
            this.name('SpTree');
            this.prmOpt(po);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    /**
     * initialize dom contents
     * 
     * @npte private method
     */
    initDomConts () {
        try {
            super.initDomConts();
            this.child([this.naviText()]);
            this.naviText().text("Back");
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    naviText (prm) {
        try {
            if (undefined !== prm) {
                let bck = (txt, tree) => {
                    try { tree.back(); } catch (e) {
                        console.error(e.stack);
                        throw e;
                    }
                }
                prm.execOption({ event : new Click([bck, this]) });
            }
            return this.innerComp('naviText', prm, Text);
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    load (prm) {
        try {
            super.load(prm);
            this.current(this);
            this.build();
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    current (prm) {
        try { return this.member('current', ['TreeIF'], prm); } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    next (elm_cmp) {
        try {
            let tchd   = this.current().treeChild();
            if (0 === tchd.length) {
                return;
            }
            this.nextEvent()[0](this, this.nextEvent()[1]);
            
            let tree   = this;
            let reb_cb = () => {
                try {
                    for (let tidx in tchd) {
                        if (elm_cmp.getId() === tchd[tidx].treeComp().getId()) {
                            tree.build(tchd[tidx]);
                            break;
                        }
                    }
                } catch (e) {
                    console.error(e.stack);
                    throw e;
                }
            }
            for (let tidx in tchd) {
                /* destroy current elements */
                tchd[tidx].treeComp().destroy(
                    (tidx == tchd.length-1) ? reb_cb : undefined
                );
            }
            
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    back () {
        try {
            let pnt  = this.current().treeParent();
            let tree = this;
            let reb_cb = () => {
                try {
                    tree.build(pnt);
                } catch (e) {
                    console.error(e.stack);
                    throw e;
                }
            }
            
            if (null !== pnt) {
                this.backEvent()[0](this, this.backEvent()[1]);
                let tchd = this.current().treeChild();
                if (0 === tchd.length) {
                    /* no contents */
                    reb_cb();
                    return;
                }
                for (let tidx in tchd) {
                    /* destroy current elements */
                    tchd[tidx].treeComp().destroy(
                        (tidx == tchd.length-1) ? reb_cb : undefined
                    );
                }
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    backEvent (fnc, prm) {
        try {
            if (undefined === fnc) {
                /* getter */
                return (undefined === this.m_backevt) ? [()=>{},null] : this.m_backevt; 
            }
            /* setter */
            if ('function' !== typeof fnc) {
                throw new Error('invalid parameter');
            }
            this.m_backevt = [fnc, prm];
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    nextEvent (fnc, prm) {
        try {
            if (undefined === fnc) {
                /* getter */
                return (undefined === this.m_nextevt) ? [()=>{},null] : this.m_nextevt;
            }
            /* setter */
            if ('function' !== typeof fnc) {
                throw new Error('invalid parameter');
            }
            this.m_nextevt = [fnc, prm];
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    build (prm) {
        try {
            if (undefined !== prm) {
                this.current(prm);
            }
            
            let tchd = this.current().treeChild();
            if (0 === tchd.length) {
                /* thre is no child */
                return;
            }
            
            let elm_cmp = null;
            for (let tidx in tchd) {
                elm_cmp = null;
                
                if (null !== tchd[tidx].treeKey()) {
                    if (null === tchd[tidx].treeValue()) {
                        /* index */
                        elm_cmp    = this.indexElem_func()(tchd[tidx]);
                        let nxt_cb = (clk_cmp, tree) => {
                            try { tree.next(clk_cmp); } catch (e) {
                                console.error(e.stack);
                                throw e;
                            }
                        };
                        elm_cmp.execOption({ event : [ new Click([nxt_cb, this]) ] });
                    } else {
                        /* key-value */
                        elm_cmp = this.kvElem_func()(tchd[tidx]);
                    }
                    tchd[tidx].treeComp(elm_cmp);
                    this.child([elm_cmp]);
                }
                
            }
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    indexElem_func (prm) {
        try {
            let ret = this.member('indexElem_func', 'function', prm);
            if (null === ret) {
                throw new Error('could not find element');
            }
            return ret;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
    
    kvElem_func (prm) {
        try {
            let ret = this.member('kvElem_func', 'function', prm);
            if (null === ret) {
                throw new Error('could not find element');
            }
            return ret;
        } catch (e) {
            console.error(e.stack);
            throw e;
        }
    }
}
module.exports = mf.comp.SpTree;
/* end of file */
