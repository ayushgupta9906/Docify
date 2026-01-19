'use client';

import React, { useEffect, useState, useCallback } from 'react';
import * as pdfjs from 'pdfjs-dist';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    rectSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { X, GripVertical, Check } from 'lucide-react';

// Setup pdfjs worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PageItem {
    id: string; // "page-1", "page-2", etc.
    index: number; // 0-indexed original position
    thumbnail: string; // base64 image
}

interface PDFPreviewProps {
    file: File;
    mode: 'reorder' | 'delete';
    onUpdate: (data: any) => void;
}

interface SortablePageProps {
    page: PageItem;
    mode: 'reorder' | 'delete';
    isSelected?: boolean;
    onToggleSelect?: (index: number) => void;
}

function SortablePage({ page, mode, isSelected, onToggleSelect }: SortablePageProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: page.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative group bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm border-2 transition-all ${isDragging ? 'opacity-50 scale-105 shadow-xl border-blue-500' :
                    isSelected ? 'border-red-500 ring-2 ring-red-200' : 'border-transparent hover:border-blue-300'
                }`}
        >
            <div className="aspect-[3/4] relative overflow-hidden rounded bg-gray-100 dark:bg-gray-700">
                <img src={page.thumbnail} alt={`Page ${page.index + 1}`} className="w-full h-full object-contain" />

                {mode === 'reorder' && (
                    <div {...attributes} {...listeners} className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-gray-800/90 rounded shadow hover:bg-white cursor-grab active:cursor-grabbing">
                        <GripVertical className="w-4 h-4 text-gray-600" />
                    </div>
                )}

                {mode === 'delete' && (
                    <button
                        onClick={() => onToggleSelect?.(page.index)}
                        className={`absolute top-2 right-2 p-2 rounded-full shadow transition-all ${isSelected ? 'bg-red-500 text-white' : 'bg-white/90 dark:bg-gray-800/90 text-gray-400 hover:text-red-500'
                            }`}
                    >
                        {isSelected ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </button>
                )}
            </div>
            <div className="mt-2 text-center text-xs font-medium text-gray-500">
                Page {page.index + 1}
            </div>
        </div>
    );
}

export default function PDFPreview({ file, mode, onUpdate }: PDFPreviewProps) {
    const [pages, setPages] = useState<PageItem[]>([]);
    const [selectedPages, setSelectedPages] = useState<number[]>([]); // indices of pages to delete
    const [loading, setLoading] = useState(true);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const loadPDF = useCallback(async () => {
        setLoading(true);
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            const loadedPages: PageItem[] = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 0.5 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (context) {
                    await page.render({ canvasContext: context, viewport }).promise;
                    loadedPages.push({
                        id: `page-${i}`,
                        index: i - 1,
                        thumbnail: canvas.toDataURL(),
                    });
                }
            }
            setPages(loadedPages);

            if (mode === 'reorder') {
                onUpdate({ order: loadedPages.map(p => p.index + 1) });
            } else {
                onUpdate({ pages: [] });
            }
        } catch (error) {
            console.error('Error loading PDF:', error);
        } finally {
            setLoading(false);
        }
    }, [file, mode, onUpdate]);

    useEffect(() => {
        loadPDF();
    }, [loadPDF]);

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setPages((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                if (mode === 'reorder') {
                    onUpdate({ order: newItems.map(p => p.index + 1) });
                }

                return newItems;
            });
        }
    };

    const toggleSelect = (index: number) => {
        setSelectedPages(prev => {
            const newSelection = prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index];

            onUpdate({ pages: newSelection.map(i => i + 1) });
            return newSelection;
        });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading PDF pages...</p>
            </div>
        );
    }

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {mode === 'reorder' ? 'Rearrange Pages' : 'Select Pages to Remove'}
                </h3>
                <span className="text-sm text-gray-500">
                    {pages.length} Pages Total
                </span>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={pages.map(p => p.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {pages.map((page) => (
                            <SortablePage
                                key={page.id}
                                page={page}
                                mode={mode}
                                isSelected={selectedPages.includes(page.index)}
                                onToggleSelect={toggleSelect}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {mode === 'delete' && selectedPages.length > 0 && (
                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg text-center">
                    <p className="text-red-600 dark:text-red-400 font-medium">
                        {selectedPages.length} {selectedPages.length === 1 ? 'page' : 'pages'} selected for removal
                    </p>
                </div>
            )}
        </div>
    );
}
