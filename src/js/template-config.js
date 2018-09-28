export default {
    baiduTemplate: {
        for: {
            tpl: `
<!--大家好-->
<ul>
    <%for(var i=0;i<list.length;i++){%>
        <li><%=list[i].name%></li>
    <%}%>
</ul>`,
            use: `var data={
    list: [
        {
            name: '喜洋洋'
        },
        {
            name: '灰太狼'
        },
        {
            name: 'hongrunhui'
        }
    ],
};
var bat=baidu.template;
var html=bat('template',data);
document.getElementById('results').innerHTML=html;
`
        },
        if: {}
    },
    doT: {
        for: {
            tpl: `<ul>
    {{~it.list :value:index }}
        <li>{{=value.name}}</li>
    {{~}}
</ul>`,
            use: `
var data = {
    list: [
        {
            name: '喜洋洋'
        },
        {
            name: '灰太狼'
        },
        {
            name: 'hongrunhui'
        }
    ]
};
var tempFn = doT.template(document.getElementById('template').innerText);
var resultText = tempFn(data);
document.getElementById('results').innerHTML=resultText;                
`
        }
    },
    jqueryTmpl: {
        for: {
            tpl: "<ul><li>${name}</li></ul>",
            use: `var data = [
    {
        name: '喜洋洋'
    },
    {
        name: '灰太狼'
    },
    {
        name: 'hongrunhui'
    }
];
var tpl = document.getElementById('template').innerHTML;
$.tmpl(tpl, data).appendTo( "#results" );`
        }
    },
    artTemplate: {
        for: {
            tpl: `<ul>
    {{each list}}
        <li>{{$index}}:{{$value.name}}</li>
    {{/each}}
</ul>`,
            use: `var data = {
list: [
        {
            name: '喜洋洋'
        },
        {
            name: '灰太狼'
        },
        {
            name: 'hongrunhui'
        }
    ]
};
var html = artTemplate('template', data);
document.getElementById("results").innerHTML = html;`
        }
    },
    ejs: {
        for: {
            tpl: `<ul>
<% list.forEach(function(item){ %>
    <li><%= item.name %></li>
<% }); %>
</ul>`,
        use: `
var tpl = document.getElementById('template').innerHTML;
var data = {
    list: [
    {
        name: '喜洋洋'
    },
    {
        name: '灰太狼'
    },
    {
        name: 'hongrunhui'
    }
    ]
};
document.getElementById('results').innerHTML = ejs.render(tpl, data);`
        }
    },
    handlebars: {},
    juicer: {
        for: {
            tpl: "<ul>{@each list as item, index}<li>${index}: ${item.name}<li>{@/each}</ul>",
            use: `
var tpl = document.getElementById('template').innerHTML;
var data = {
    list: [
    {
        name: '喜洋洋'
    },
    {
        name: '灰太狼'
    },
    {
        name: 'hongrunhui'
    }
    ]
};
document.getElementById('results').innerHTML = juicer(tpl, data);`
        }
    },
    mustache: {
        for: {
            tpl: `<ul>
    {{#list}}
        <li>
            {{name}}
        </li>
    {{/list}}
</ul>`,
            use: `
var tpl = document.getElementById('template').innerHTML;
var data = {
    list: [
    {
        name: '喜洋洋'
    },
    {
        name: '灰太狼'
    },
    {
        name: 'hongrunhui'
    }
    ]
};
document.getElementById('results').innerHTML = Mustache.render(tpl, data);`
        }
    },
    template: {
        for: {
            tpl: `
<ul>
    <%for(var i = 0; i < list.length; i++) {%>
    <li><%:=list[i].name%></li>
    <%}%>
</ul>`,
        use: `
var tpl = document.getElementById('template').innerHTML;
var data = {
    list: [
    {
        name: '喜洋洋'
    },
    {
        name: '灰太狼'
    },
    {
        name: 'hongrunhui'
    }
    ]
};
document.getElementById('results').innerHTML = template(tpl, data);`
        }
    },
    wuTmpl: {
        for: {
            tpl: `<ul>
    {{each list item i}}
    <li>
    {{ item.name }}
    </li>		
    {{/each}}
</ul>
    `,
    use: `
var tpl = document.getElementById('template').innerHTML;
var data = {
    list: [
    {
        name: '喜洋洋'
    },
    {
        name: '灰太狼'
    },
    {
        name: 'hongrunhui'
    }
    ]
};
document.getElementById('results').innerHTML = wu.tmpl.render(tpl, data);`
        }
    },
    riot: {
        for: {
            tpl: `<ul>
    <li each={item, i in opts.list}>{item.name}</li>
</ul>`,
            use: `var data = {
list: [
        {
            name: '喜洋洋'
        },
        {
            name: '灰太狼'
        },
        {
            name: 'hongrunhui'
        }
    ]
};
riot.mount('div#results', 'my-tag', data);`
        }
    }
};