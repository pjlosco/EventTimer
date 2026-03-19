import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { Result, Gender } from '../types/models';
import { ResultRow } from '../components/ResultRow';
import {
  tabulateResults,
  filterResultsByGender,
  filterResultsByAgeGroup,
  AGE_BRACKET_PRESETS,
} from '../services/resultsService';

type ResultsScreenProps = {
  eventId: string;
};

type FilterType = 'All' | Gender | string;

export function ResultsScreen({ eventId }: ResultsScreenProps) {
  const [results, setResults] = useState<Result[]>([]);
  const [filteredResults, setFilteredResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [genderFilter, setGenderFilter] = useState<FilterType>('All');
  const [ageGroupFilter, setAgeGroupFilter] = useState<FilterType>('All');

  const loadResults = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    try {
      const allResults = await tabulateResults(eventId);
      setResults(allResults);
      applyFilters(allResults, genderFilter, ageGroupFilter);
    } catch (error) {
      console.error('Error loading results:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [eventId, genderFilter, ageGroupFilter]);

  const applyFilters = (
    resultsToFilter: Result[],
    gender: FilterType,
    ageGroup: FilterType
  ) => {
    let filtered = resultsToFilter;

    if (gender !== 'All') {
      filtered = filterResultsByGender(filtered, gender as Gender);
    }

    if (ageGroup !== 'All') {
      filtered = filterResultsByAgeGroup(filtered, ageGroup);
    }

    setFilteredResults(filtered);
  };

  useFocusEffect(
    useCallback(() => {
      loadResults();
    }, [loadResults])
  );

  const handleGenderFilter = (gender: FilterType) => {
    setGenderFilter(gender);
    applyFilters(results, gender, ageGroupFilter);
  };

  const handleAgeGroupFilter = (ageGroup: FilterType) => {
    setAgeGroupFilter(ageGroup);
    applyFilters(results, genderFilter, ageGroup);
  };

  // Get unique age groups from results
  const availableAgeGroups = Array.from(
    new Set(results.map((r) => r.ageGroup).filter((ag): ag is string => !!ag))
  ).sort();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0d6b8a" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filters */}
      <View style={styles.filters}>
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Gender:</Text>
          <View style={styles.filterRow}>
            {['All', 'M', 'F'].map((gender) => (
              <TouchableOpacity
                key={gender}
                style={[
                  styles.filterChip,
                  genderFilter === gender && styles.filterChipActive,
                ]}
                onPress={() => handleGenderFilter(gender)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    genderFilter === gender && styles.filterChipTextActive,
                  ]}
                >
                  {gender === 'All' ? 'All' : gender === 'M' ? 'Male' : 'Female'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {availableAgeGroups.length > 0 && (
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Age Group:</Text>
            <View style={styles.filterRow}>
              <TouchableOpacity
                style={[
                  styles.filterChip,
                  ageGroupFilter === 'All' && styles.filterChipActive,
                ]}
                onPress={() => handleAgeGroupFilter('All')}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    ageGroupFilter === 'All' && styles.filterChipTextActive,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              {availableAgeGroups.map((ag) => (
                <TouchableOpacity
                  key={ag}
                  style={[
                    styles.filterChip,
                    ageGroupFilter === ag && styles.filterChipActive,
                  ]}
                  onPress={() => handleAgeGroupFilter(ag)}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      ageGroupFilter === ag && styles.filterChipTextActive,
                    ]}
                  >
                    {ag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Results List */}
      <FlatList
        data={filteredResults}
        keyExtractor={(item, index) => `result-${item.bibNumber}-${index}`}
        renderItem={({ item }) => (
          <ResultRow result={item} showAgeGroup={ageGroupFilter === 'All'} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => loadResults(true)} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No results yet</Text>
            <Text style={styles.emptySubtext}>
              Start the timer and log finishers to see results
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f8',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filters: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e4e8',
  },
  filterSection: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#f5f7f8',
    borderWidth: 1,
    borderColor: '#e0e4e8',
  },
  filterChipActive: {
    backgroundColor: '#0d6b8a',
    borderColor: '#0d6b8a',
  },
  filterChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
  filterChipTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  empty: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});
