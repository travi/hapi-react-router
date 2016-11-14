import React from 'react';
import {Link} from 'react-router';

export default function Wrap({children}) {
    return (
        <div id="wrap">
            <nav>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/foo">Foo</Link></li>
                    <li><Link to="/bar">Bar</Link></li>
                </ul>
            </nav>
            {children}
        </div>
    );
}

Wrap.displayName = 'Wrap';
