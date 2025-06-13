// Supabase configuration
const SUPABASE_URL = 'https://aodovkzddxblxjhiclci.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvZG92a3pkZHhibHhqaGljbGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0Nzc0MzEsImV4cCI6MjA2NDA1MzQzMX0.xjQlWkMoCMyNakjPuDOAreQ2P0EBOvT41ZNmYSudB0s';

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Auth helpers
const authHelpers = {
    async signUp(email, password, fullName = null) {
        const signUpData = {
            email: email,
            password: password,
        };

        // Add user metadata if full name is provided
        if (fullName) {
            signUpData.options = {
                data: {
                    full_name: fullName,
                    display_name: fullName
                }
            };
        }

        const { data, error } = await supabaseClient.auth.signUp(signUpData);
        return { data, error };
    },

    async signIn(email, password) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password,
        });
        return { data, error };
    },

    async signOut() {
        const { error } = await supabaseClient.auth.signOut();
        return { error };
    },

    async resetPassword(email) {
        const { data, error } = await supabaseClient.auth.resetPasswordForEmail(email);
        return { data, error };
    },

    async getCurrentUser() {
        const { data: { user } } = await supabaseClient.auth.getUser();
        return user;
    },

    // Users table functions
    async getUserProfile(userId = null) {
        try {
            // If no userId provided, use current user
            if (!userId) {
                const user = await this.getCurrentUser();
                if (!user) return null;
                userId = user.id;
            }

            const { data, error } = await supabaseClient
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            return { data, error };
        } catch (err) {
            return { data: null, error: err };
        }
    },

    async updateUserProfile(updates) {
        try {
            const user = await this.getCurrentUser();
            if (!user) return { data: null, error: new Error('Not authenticated') };

            const { data, error } = await supabaseClient
                .from('users')
                .update(updates)
                .eq('id', user.id)
                .select()
                .single();

            return { data, error };
        } catch (err) {
            return { data: null, error: err };
        }
    },

    async updateLastSeen() {
        try {
            const user = await this.getCurrentUser();
            if (!user) return;

            await supabaseClient
                .from('users')
                .update({ last_seen_at: new Date().toISOString() })
                .eq('id', user.id);
        } catch (err) {
            console.error('Error updating last seen:', err);
        }
    },

    // Spaces table functions
    async getUserSpaces(userId = null) {
        try {
            // If no userId provided, use current user
            if (!userId) {
                const user = await this.getCurrentUser();
                if (!user) return { data: [], error: new Error('Not authenticated') };
                userId = user.id;
            }

            const { data, error } = await supabaseClient
                .from('spaces')
                .select('*')
                .eq('user_id', userId)
                .eq('is_archived', false)
                .order('order_index', { ascending: true });

            return { data, error };
        } catch (err) {
            return { data: [], error: err };
        }
    },

    async createSpace(spaceData) {
        try {
            const user = await this.getCurrentUser();
            if (!user) return { data: null, error: new Error('Not authenticated') };

            // Get the next order index
            const { data: existingSpaces } = await supabaseClient
                .from('spaces')
                .select('order_index')
                .eq('user_id', user.id)
                .eq('is_archived', false)
                .order('order_index', { ascending: false })
                .limit(1);

            const nextOrderIndex = existingSpaces.length > 0 ? existingSpaces[0].order_index + 1 : 0;

            const { data, error } = await supabaseClient
                .from('spaces')
                .insert({
                    user_id: user.id,
                    name: spaceData.name,
                    description: spaceData.description || null,
                    color: spaceData.color || null,
                    emoji: spaceData.emoji || null,
                    order_index: nextOrderIndex,
                    settings: spaceData.settings || null
                })
                .select()
                .single();

            return { data, error };
        } catch (err) {
            return { data: null, error: err };
        }
    },

    async updateSpace(spaceId, updates) {
        try {
            const user = await this.getCurrentUser();
            if (!user) return { data: null, error: new Error('Not authenticated') };

            const { data, error } = await supabaseClient
                .from('spaces')
                .update(updates)
                .eq('id', spaceId)
                .eq('user_id', user.id)
                .select()
                .single();

            return { data, error };
        } catch (err) {
            return { data: null, error: err };
        }
    },

    async setActiveSpace(spaceId) {
        try {
            const user = await this.getCurrentUser();
            if (!user) return { error: new Error('Not authenticated') };

            console.log('DB: Setting active space to:', spaceId);

            // Use a single update with a WHERE clause for better atomicity
            // First verify the space exists and belongs to the user
            const { data: targetSpace, error: verifyError } = await supabaseClient
                .from('spaces')
                .select('id, name')
                .eq('id', spaceId)
                .eq('user_id', user.id)
                .single();

            if (verifyError || !targetSpace) {
                console.error('DB: Target space not found or access denied:', verifyError);
                return { error: new Error('Space not found or access denied') };
            }

            console.log('DB: Target space verified:', targetSpace.name);

            // Deactivate all spaces for this user
            const { error: deactivateError } = await supabaseClient
                .from('spaces')
                .update({ is_active: false })
                .eq('user_id', user.id);

            if (deactivateError) {
                console.error('DB: Error deactivating spaces:', deactivateError);
                return { error: deactivateError };
            }

            console.log('DB: All spaces deactivated');

            // Activate the target space
            const { error: activateError } = await supabaseClient
                .from('spaces')
                .update({ 
                    is_active: true,
                    last_accessed_at: new Date().toISOString()
                })
                .eq('id', spaceId)
                .eq('user_id', user.id);

            if (activateError) {
                console.error('DB: Error activating space:', activateError);
                return { error: activateError };
            }

            console.log('DB: Space activated successfully:', targetSpace.name);
            return { error: null };
        } catch (err) {
            console.error('DB: Exception in setActiveSpace:', err);
            return { error: err };
        }
    },

    async deleteSpace(spaceId) {
        try {
            const user = await this.getCurrentUser();
            if (!user) return { error: new Error('Not authenticated') };

            // Soft delete by setting is_archived to true
            const { error } = await supabaseClient
                .from('spaces')
                .update({ is_archived: true })
                .eq('id', spaceId)
                .eq('user_id', user.id);

            return { error };
        } catch (err) {
            return { error: err };
        }
    },

    // Realtime subscription for spaces
    subscribeToSpaces(userId, onUpdate) {
        try {
            const subscription = supabaseClient
                .channel('spaces_changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'spaces',
                        filter: `user_id=eq.${userId}`
                    },
                    onUpdate
                )
                .subscribe();

            return subscription;
        } catch (err) {
            console.error('Error setting up spaces subscription:', err);
            return null;
        }
    },

    // Save tabs data for a specific space
    async saveTabsToSpace(spaceId, tabsData) {
        try {
            const user = await this.getCurrentUser();
            if (!user) return { error: new Error('Not authenticated') };

            console.log('DB: Saving tabs to space:', spaceId, 'Tab count:', tabsData.length);

            const { error } = await supabaseClient
                .from('spaces')
                .update({ 
                    tabs_data: tabsData,
                    last_accessed_at: new Date().toISOString()
                })
                .eq('id', spaceId)
                .eq('user_id', user.id);

            if (error) {
                console.error('DB: Error saving tabs to space:', error);
                return { error };
            }

            console.log('DB: Successfully saved tabs to space');
            return { error: null };
        } catch (err) {
            console.error('DB: Exception saving tabs to space:', err);
            return { error: err };
        }
    },

    // Save tabs data for the currently active space
    async saveTabsToActiveSpace(tabsData) {
        try {
            const user = await this.getCurrentUser();
            if (!user) return { error: new Error('Not authenticated') };

            // Get the currently active space
            const { data: spaces, error: spacesError } = await supabaseClient
                .from('spaces')
                .select('id, name')
                .eq('user_id', user.id)
                .eq('is_active', true)
                .single();

            if (spacesError || !spaces) {
                console.error('DB: No active space found for tab saving:', spacesError);
                return { error: new Error('No active space found') };
            }

            console.log('DB: Saving tabs to active space:', spaces.name, 'Tab count:', tabsData.length);

            // Save tabs to the active space
            return await this.saveTabsToSpace(spaces.id, tabsData);
        } catch (err) {
            console.error('DB: Exception saving tabs to active space:', err);
            return { error: err };
        }
    },

    // Unsubscribe from realtime
    unsubscribeFromSpaces(subscription) {
        if (subscription) {
            supabaseClient.removeChannel(subscription);
        }
    }
}; 