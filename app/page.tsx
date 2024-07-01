'use client'
import { useEffect, useState } from "react";
import axios from 'axios';
import React from "react";

export default function Home() {
    const [blocks, setBlocks] = useState([] as any[]);
    const [newBlock, setNewBlock] = useState({ content: '', type: 'text', text_type: 'p', height:100, width: 100});
    const [isEditing, setIsEditing] = useState(null as any);

    const fetchBlocks = async () => {
        const res = await fetch('/api/db');
        const data = await res.json();
        setBlocks(data);
    };

    useEffect(() => {
        fetchBlocks();
    }, []);

    const handleCreateBlock = async (e: any) => {
        e.preventDefault();
        const res = await axios.post('/api/db', newBlock);
        setBlocks([...blocks, res.data]);
        setNewBlock({ content: '', type: 'text', text_type: 'p', height: 100, width: 100} );
    };

    const handleUpdateBlock = async (id: string, updatedBlock: any) => {
        try {
            const res = await axios.put(`/api/db`, { id, ...updatedBlock });
            setBlocks(blocks.map(block => (block.id === id ? res.data : block)));
            setIsEditing(null);
        } catch (error) {
            console.error('Error updating block:', error);
        }
    };

    const handleDeleteBlock = async (id: string) => {
        try {
            await axios.delete(`/api/db`, { data: { id } });
            setBlocks(blocks.filter(block => block.id !== id));
        } catch (error) {
            console.error('Error deleting block:', error);
        }
    }

    return (
        <div className="p-8">
            <h1 className="text-4xl font-bold mb-8">Simple Notion Clone</h1>
            <form onSubmit={handleCreateBlock} className="mb-8">
                <div className="mb-4">
                    <label className="block mb-2">Content</label>
                    <textarea
                        value={newBlock.content}
                        onChange={(e) => setNewBlock({ ...newBlock, content: e.target.value })}
                        className="p-2 border rounded w-full"
                    />
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Type</label>
                    <select
                        value={newBlock.type}
                        onChange={(e) => setNewBlock({ ...newBlock, type: e.target.value })}
                        className="p-2 border rounded w-full"
                    >
                        <option value="text">Text</option>
                        <option value="image">Image</option>
                    </select>
                </div>
                {newBlock.type === 'text' && (
                    <div className="mb-4">
                        <label className="block mb-2">Tag</label>
                        <select
                            value={newBlock.text_type}
                            onChange={(e) => setNewBlock({ ...newBlock, text_type: e.target.value })}
                            className="p-2 border rounded w-full"
                        >
                            <option value="p">Paragraph</option>
                            <option value="h1">H1</option>
                            <option value="h2">H2</option>
                            <option value="h3">H3</option>
                        </select>
                    </div>
                )}
                {newBlock.type === 'image' && (
                    <>
                        <div className="mb-4">
                            <label className="block mb-2">Image Height</label>
                            <input
                                type="text"
                                value={(newBlock.height!)}
                                onChange={(e) => setNewBlock({ ...newBlock, height:parseInt(e.target.value)})}
                                className="p-2 border rounded w-full"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Image Width</label>
                            <input
                                type="text"
                                value={(newBlock.width!)}
                                onChange={(e) => setNewBlock({ ...newBlock, width:parseInt(e.target.value)})}
                                className="p-2 border rounded w-full"
                            />
                        </div>
                    </>
                )}
                <button type="submit" className="p-2 bg-blue-500 text-white rounded">Add Block</button>
            </form>
            <div>
                {blocks.map(block => (
                    block && (
                    <div key={block.id} className="p-4 border border-gray-200 rounded my-4">
                        {isEditing === block.id ? (
                            <>
                                <textarea
                                    value={block.content}
                                    onChange={(e) => setBlocks(blocks.map(b => (b.id === block.id ? { ...b, content: e.target.value } : b)))}
                                    className="p-2 border rounded w-full mb-2"
                                />
                                {block.type === 'text' && (
                                    <select
                                        value={block.text_type}
                                        onChange={(e) => setBlocks(blocks.map(b => (b.id === block.id ? { ...b, text_type: e.target.value } : b)))}
                                        className="p-2 border rounded w-full mb-2"
                                    >
                                        <option value="p">Paragraph</option>
                                        <option value="h1">H1</option>
                                        <option value="h2">H2</option>
                                        <option value="h3">H3</option>
                                    </select>
                                )}
                                {block.type === 'image' && (
                                    <>
                                        <input
                                            type="text"
                                            value={block.height}
                                            onChange={(e) => setBlocks(blocks.map(b => (b.id === block.id ? { ...b, height:parseInt(e.target.value)} : b)))}
                                            className="p-2 border rounded w-full mb-2"
                                        />
                                        <input
                                            type="text"
                                            value={block.width}
                                            onChange={(e) => setBlocks(blocks.map(b => (b.id === block.id ? { ...b, width:parseInt(e.target.value)} : b)))}
                                            className="p-2 border rounded w-full mb-2"
                                        />
                                    </>
                                )}
                                <button onClick={() => handleUpdateBlock(block.id, block)} className="p-2 bg-green-500 text-white rounded">Save</button>
                            </>
                        ) : (
                            <>
                                {block.type === 'text' ? (
 <div>
        {(() => {
            switch(block.text_type) {
                case 'p':
                    return <p>{block.content}</p>;
                case 'h1':
                    return <h1 className="text-3xl font-bold">{block.content}</h1>;
                case 'h2':
                    return <h2 className="text-2xl font-semibold">{block.content}</h2>;
                case 'h3':
                    return <h3 className="text-xl">{block.content}</h3>;
                default:
                    return null;
            }
        })()}
    </div>
                                ) : (
                                    <img
                                        src={block.content}
                                        height={block.height}
                                        width={block.width}
                                        alt="Block"
                                    />
                                )}
                                <button onClick={() => setIsEditing(block.id)} className="p-2 bg-yellow-500 text-white rounded mt-2">Edit</button>
                                <button onClick={() => handleDeleteBlock(block.id)} className="p-2 bg-red-500 text-white rounded mt-2 ml-8">Delete</button>
                            </>
                        )}
                    </div>
                )))}
            </div>
        </div>
    );
}
