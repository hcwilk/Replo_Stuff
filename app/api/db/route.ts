
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl!, supabaseKey!);

export async function GET(req:NextRequest, res:NextResponse) {
    const {data, error} = await supabase.from('content_blocks').select('*')
    if (error) return NextResponse.json({error: error.message}, {status: 500})
    return NextResponse.json(data)
}

export async function POST(req:NextRequest, res:NextResponse) {
    try{
    const block = await req.json()
    console.log(block)
    const {data, error} = await supabase.from('content_blocks').insert(block).select()
    return NextResponse.json(data![0], {status: 201})

    }catch(error:any){
        console.log(error)
    return NextResponse.json({error: error.message}, {status: 500})
    }
}

export async function PUT(req:NextRequest, res:NextResponse) {
    const {id, ...block} = await req.json()
    const {data, error} = await supabase.from('content_blocks').update(block).eq('id', id).select()
    console.log(error)
    if (error) return NextResponse.json({error: error.message})
    return NextResponse.json(data![0])
}

export async function DELETE(req:NextRequest, res:NextResponse) {
    const {id} = await req.json()
    const {data, error} = await supabase.from('content_blocks').delete().eq('id', id)
    console.log(error)
    if (error) return NextResponse.json({error: error.message})
    return NextResponse.json(data)
}
