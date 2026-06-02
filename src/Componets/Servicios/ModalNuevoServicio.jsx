import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { toast } from '../GoeyToaster';

export default function ModalNuevoServicio({ isOpen, onClose, onSuccess }) {
    // Estado inicial limpio para la creación
    const [formData, setFormData] = useState({
        codigo_servicio: '',
        nombre_servicio: '',
        descripcion: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const apiUrl = `http://${window.location.hostname}:5000/Servicios`;
            const resp = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });

            const result = await resp.json();

            if (resp.ok) {
                // Limpiar formulario y notificar éxito
                setFormData({ codigo_servicio: '', nombre_servicio: '', descripcion: '' });
                toast.success('Servicio creado', { description: result.message || '' });
                if (onSuccess) onSuccess();
            } else {
                setError(result.error || 'Error al crear el servicio');
                toast.error('Error', { description: result.error || 'Error al crear el servicio' });
            }
        } catch (err) {
                setError('Error de conexión con el servidor');
                toast.error('Error', { description: 'Error de conexión con el servidor' });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">

                {/* Header del Modal */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Crear Nuevo Servicio</h2>
                        <p className="text-xs text-slate-400">Introduce los detalles del servicio técnico</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-red-500 transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">

                    {error && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs flex items-center gap-2 animate-shake">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Campo Código */}
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1">Código Identificador</label>
                            <input
                                name="codigo_servicio"
                                required
                                placeholder="Ej: SERV-001"
                                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                                value={formData.codigo_servicio}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Campo Nombre */}
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1">Nombre del Servicio</label>
                            <input
                                name="nombre_servicio"
                                required
                                placeholder="Nombre descriptivo"
                                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm font-medium"
                                value={formData.nombre_servicio}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Campo Descripción */}
                        <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase ml-1 mb-1">Descripción (Opcional)</label>
                            <textarea
                                name="descripcion"
                                rows="3"
                                placeholder="Detalles sobre el proceso o materiales..."
                                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all text-sm"
                                value={formData.descripcion}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3.5 text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-2xl transition-all"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Save size={18} />
                                    Guardar Servicio
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}